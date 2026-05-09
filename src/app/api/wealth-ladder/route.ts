import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const latestBalance = await prisma.balance.findFirst({ orderBy: { date: "desc" } });
    let totalAssets = 0;
    let totalLiabilities = 0;

    if (latestBalance) {
      const currentBalances = await prisma.balance.findMany({ where: { date: latestBalance.date } });
      currentBalances.forEach(bal => {
        if (bal.type?.toLowerCase().includes("tillgång") || bal.type?.toLowerCase() === "tillgångar") {
            totalAssets += bal.value;
        } else if (bal.type?.toLowerCase().includes("skuld") || bal.type?.toLowerCase() === "skulder") {
            totalLiabilities += Math.abs(bal.value); // Ensure it's positive for formulas
        }
      });
    }

    const netWorth = totalAssets - totalLiabilities;
    const yearlyPassiveIncome = Math.max(0, netWorth) * 0.04; // 4% rule
    const monthlyPassiveIncome = yearlyPassiveIncome / 12;

    // Monthly expenses (rolling 12m from latest data)
    const latestTx = await prisma.transaction.findFirst({
        where: { area: { in: ["Utgift", "Inkomst"] } },
        orderBy: { date: 'desc' }
    });

    const oneYearAgo = latestTx ? new Date(latestTx.date) : new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const expenses = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { 
        date: { gte: oneYearAgo },
        area: "Utgift",
        AND: [
          { OR: [{ transferFrom: "" }, { transferFrom: null }] },
          { OR: [{ transferTo: "" }, { transferTo: null }] }
        ]
      }
    });

    const oldestExpenseTransaction = await prisma.transaction.findFirst({
        where: { 
          date: { gte: oneYearAgo }, 
          area: "Utgift",
          AND: [
            { OR: [{ transferFrom: "" }, { transferFrom: null }] },
            { OR: [{ transferTo: "" }, { transferTo: null }] }
          ]
        },
        orderBy: { date: 'asc' }
    });

    let monthsMeasured = 12;
    if (oldestExpenseTransaction) {
        // approximate months passed since oldest transaction in the 1-year window
        const diffTime = Math.abs(new Date().getTime() - oldestExpenseTransaction.date.getTime());
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        monthsMeasured = diffMonths > 0 ? diffMonths : 1;
    }

    // Amount can be stored negatively 
    const totalExpenseAmount = Math.abs(expenses?._sum?.amount || 0);
    const avgMonthlyExpenses = totalExpenseAmount > 0 && monthsMeasured > 0 
                                ? totalExpenseAmount / monthsMeasured 
                                : 0;

    // Determine liquid assets for lower levels (assuming buffer + preserve)
    let liquidCapital = 0;
    if (latestBalance) {
      const currentBalances = await prisma.balance.findMany({ where: { date: latestBalance.date } });
      const mappings = await prisma.bucketMapping.findMany();
      const bucketByDesc: Record<string, string> = {};
      mappings.forEach((m: any) => { bucketByDesc[m.balanceDescription] = m.bucket; });

      currentBalances.forEach(bal => {
        const desc = bal.description || "";
        const bucket = bucketByDesc[desc];
        if (bucket === "BUFFER" || bucket === "PRESERVE") {
          liquidCapital += bal.value;
        }
      });
    }

    return NextResponse.json({
      netWorth,
      totalAssets,
      totalLiabilities,
      liquidCapital,
      monthlyPassiveIncome,
      avgMonthlyExpenses: Math.max(avgMonthlyExpenses, 1), // Avoid div by 0 in UI
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
