import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Get the most recent balance date
    const latestBalance = await prisma.balance.findFirst({
      orderBy: { date: "desc" }
    });

    let liquidCapital = 0;
    
    if (latestBalance) {
      const latestDate = latestBalance.date;

      // Find all balances on that date
      const currentBalances = await prisma.balance.findMany({
        where: { date: latestDate }
      });

      // Get bucket mappings
      const mappings = await prisma.bucketMapping.findMany();
      const bucketByDesc: Record<string, string> = {};
      mappings.forEach((m: any) => { bucketByDesc[m.balanceDescription] = m.bucket; });

      // Calculate Liquid Capital (BUFFER + PRESERVE)
      currentBalances.forEach(bal => {
        const desc = bal.description || "";
        const bucket = bucketByDesc[desc];
        if (bucket === "BUFFER" || bucket === "PRESERVE") {
          liquidCapital += bal.value;
        }
      });
    }

    // 2. Real Savings rate calculation (rolling 12m from latest data)
    const latestTx = await prisma.transaction.findFirst({
      where: { area: { in: ["Utgift", "Inkomst"] } },
      orderBy: { date: 'desc' }
    });

    const oneYearAgo = latestTx ? new Date(latestTx.date) : new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const periodTransactions = await prisma.transaction.findMany({
      where: {
        date: { gte: oneYearAgo },
        area: { in: ["Utgift", "Inkomst"] },
        AND: [
          { OR: [{ transferFrom: "" }, { transferFrom: null }] },
          { OR: [{ transferTo: "" }, { transferTo: null }] }
        ]
      }
    });

    const totalIncome = periodTransactions.reduce((acc, t) => acc + (t.area === "Inkomst" ? Math.abs(t.amount) : 0), 0);
    const totalExpenses = periodTransactions.reduce((acc, t) => acc + (t.area === "Utgift" ? Math.abs(t.amount) : 0), 0);
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    // 3. Liquid Capital History for the Chart
    const allBalances = await prisma.balance.findMany({
      orderBy: { date: "asc" }
    });
    
    const mappings = await prisma.bucketMapping.findMany();
    const bucketByDesc: Record<string, string> = {};
    mappings.forEach((m: any) => { bucketByDesc[m.balanceDescription] = m.bucket; });

    const chartDataMap: Record<string, number> = {};
    allBalances.forEach(bal => {
      const desc = bal.description || "";
      const bucket = bucketByDesc[desc];
      if (bucket === "BUFFER" || bucket === "PRESERVE") {
        const monthKey = bal.date.toISOString().substring(0, 7); // YYYY-MM
        const isDebt = bal.type?.toLowerCase().includes("skuld");
        const value = isDebt ? -Math.abs(bal.value) : bal.value;
        chartDataMap[monthKey] = (chartDataMap[monthKey] || 0) + value;
      }
    });

    const chartData = Object.keys(chartDataMap).sort().map(key => ({
      month: key,
      liquidCapital: chartDataMap[key]
    }));

    // 4. Historical Metrics Table Data
    const uniqueDatesObj = await prisma.balance.findMany({
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'desc' }
    });
    
    // Fallback: Global latest 6 months average
    const latestTxForFallback = await prisma.transaction.findFirst({
      where: { area: "Utgift" },
      orderBy: { date: 'desc' }
    });
    
    let fallbackAvgSpend = 0;
    if (latestTxForFallback) {
      const fallbackEnd = new Date(latestTxForFallback.date);
      const fallbackStart = new Date(fallbackEnd);
      fallbackStart.setMonth(fallbackStart.getMonth() - 6);
      
      const fallbackTx = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          date: { gte: fallbackStart, lte: fallbackEnd },
          area: "Utgift",
          AND: [
            { OR: [{ transferFrom: "" }, { transferFrom: null }] },
            { OR: [{ transferTo: "" }, { transferTo: null }] }
          ]
        }
      });
      fallbackAvgSpend = Math.abs(fallbackTx._sum?.amount || 0) / 6;
    }
    
    const historicalMetrics = [];
    
    for (const d of uniqueDatesObj) {
      const dateQuery = d.date;
      
      const balancesForDate = await prisma.balance.findMany({
        where: { date: dateQuery }
      });
      
      let totalAssets = 0;
      let debt = 0;
      
      balancesForDate.forEach(bal => {
        if (bal.type?.toLowerCase().includes("skuld")) {
          debt += Math.abs(bal.value);
        } else if (bal.type?.toLowerCase().includes("tillgång")) {
          totalAssets += bal.value;
        }
      });
      
      const ownCapital = totalAssets - debt;
      const solvency = totalAssets > 0 ? (ownCapital / totalAssets) * 100 : 0;
      
      // Calculate trailing 6 months average spend
      const sixMonthsPrior = new Date(dateQuery);
      sixMonthsPrior.setMonth(sixMonthsPrior.getMonth() - 6);
      
      const pastTransactions = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          date: {
            gte: sixMonthsPrior,
            lte: dateQuery
          },
          area: "Utgift",
          AND: [
            { OR: [{ transferFrom: "" }, { transferFrom: null }] },
            { OR: [{ transferTo: "" }, { transferTo: null }] }
          ]
        }
      });
      
      const totalSpend6m = Math.abs(pastTransactions._sum?.amount || 0);
      let avgMonthlySpend = totalSpend6m / 6;
      let estimatedLiquidity = false;
      
      if (avgMonthlySpend === 0 && fallbackAvgSpend > 0) {
        avgMonthlySpend = fallbackAvgSpend;
        estimatedLiquidity = true;
      }
      
      const liquidityMonths = avgMonthlySpend > 0 ? (ownCapital / avgMonthlySpend) : 0;
      
      historicalMetrics.push({
        date: dateQuery.toISOString(),
        totalAssets,
        debt,
        ownCapital,
        solvency,
        liquidityMonths,
        estimatedLiquidity
      });
    }

    return NextResponse.json({
      liquidCapital,
      savingsRate,
      chartData,
      historicalMetrics
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
