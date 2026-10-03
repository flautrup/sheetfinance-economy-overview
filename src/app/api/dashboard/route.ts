import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  getBalanceSummary,
  getSavingsRate,
  getUniqueBalanceDates,
  getAverageMonthlyExpenses,
} from "@/lib/finance";

export async function GET() {
  try {
    // 1. Verify User Session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Liquid Capital (BUFFER + PRESERVE) of the latest balance sheet
    const summary = await getBalanceSummary();
    const liquidCapital = summary?.liquidCapital || 0;

    // 3. Savings Rate
    const savingsRate = await getSavingsRate(12);

    // 4. Liquid Capital History for Chart
    const allBalances = await prisma.balance.findMany({
      orderBy: { date: "asc" },
    });

    const mappings = await prisma.bucketMapping.findMany();
    const bucketByDesc: Record<string, string> = {};
    mappings.forEach((m) => {
      bucketByDesc[m.balanceDescription] = m.bucket;
    });

    const chartDataMap: Record<string, number> = {};
    allBalances.forEach((bal) => {
      const desc = bal.description || "";
      const bucket = bucketByDesc[desc];
      if (bucket === "BUFFER" || bucket === "PRESERVE") {
        const monthKey = bal.date.toISOString().substring(0, 7); // YYYY-MM
        const isDebt = bal.type?.toLowerCase().includes("skuld") || bal.type?.toLowerCase() === "skulder";
        const value = isDebt ? -Math.abs(bal.value) : bal.value;
        chartDataMap[monthKey] = (chartDataMap[monthKey] || 0) + value;
      }
    });

    const chartData = Object.keys(chartDataMap)
      .sort()
      .map((key) => ({
        month: key,
        liquidCapital: chartDataMap[key],
      }));

    // 5. Historical Metrics Table Data (Optimized: in-memory balance grouping & single pre-aggregated monthly expenses)
    const uniqueDates = await getUniqueBalanceDates();
    
    // Group allBalances by date timestamp in memory (eliminates N database roundtrips)
    const balancesByDate = new Map<number, typeof allBalances>();
    for (const bal of allBalances) {
      const timeKey = bal.date.getTime();
      let arr = balancesByDate.get(timeKey);
      if (!arr) {
        arr = [];
        balancesByDate.set(timeKey, arr);
      }
      arr.push(bal);
    }

    // Pre-aggregate monthly expenses across all months in a single query
    const rawMonthlyExpenses = await prisma.$queryRawUnsafe<Array<{ m: string; total: number }>>(`
      SELECT strftime('%Y-%m', date / 1000, 'unixepoch') as m, sum(abs(amount)) as total
      FROM "Transaction"
      WHERE area = 'Utgift'
        AND (transferFrom IS NULL OR transferFrom = '')
        AND (transferTo IS NULL OR transferTo = '')
      GROUP BY m
    `);
    const monthlyExpenseMap = new Map<string, number>();
    for (const r of rawMonthlyExpenses) {
      monthlyExpenseMap.set(r.m, Number(r.total));
    }

    function getTrailingAvgExpenses(snapshotDate: Date, monthsWindow: number = 6): { avgMonthlyExpenses: number; estimated: boolean } {
      let sum = 0;
      let countWithData = 0;
      const targetDate = new Date(snapshotDate);
      
      for (let i = 0; i < monthsWindow; i++) {
        const d = new Date(targetDate);
        d.setMonth(d.getMonth() - i);
        const monthKey = d.toISOString().substring(0, 7);
        const exp = monthlyExpenseMap.get(monthKey);
        if (exp !== undefined && exp > 0) {
          sum += exp;
          countWithData++;
        }
      }

      if (countWithData === 0) {
        return { avgMonthlyExpenses: 30000, estimated: true };
      }

      return { avgMonthlyExpenses: sum / monthsWindow, estimated: false };
    }

    const historicalMetrics = [];

    for (const dateQuery of uniqueDates) {
      const balancesForDate = balancesByDate.get(dateQuery.getTime()) || [];

      let totalAssets = 0;
      let debt = 0;

      balancesForDate.forEach((bal) => {
        const isDebt = bal.type?.toLowerCase().includes("skuld") || bal.type?.toLowerCase() === "skulder";
        const isAsset = bal.type?.toLowerCase().includes("tillgång") || bal.type?.toLowerCase() === "tillgångar";

        if (isDebt) {
          debt += Math.abs(bal.value);
        } else if (isAsset) {
          totalAssets += bal.value;
        }
      });

      const ownCapital = totalAssets - debt;
      const solvency = totalAssets > 0 ? (ownCapital / totalAssets) * 100 : 0;

      // Trailing average monthly spend for runway (using 6-month window relative to the snapshot date)
      const { avgMonthlyExpenses, estimated } = getTrailingAvgExpenses(dateQuery, 6);
      const liquidityMonths = avgMonthlyExpenses > 0 ? ownCapital / avgMonthlyExpenses : 0;

      historicalMetrics.push({
        date: dateQuery.toISOString(),
        totalAssets,
        debt,
        ownCapital,
        solvency,
        liquidityMonths,
        estimatedLiquidity: estimated,
      });
    }

    return NextResponse.json({
      liquidCapital,
      savingsRate,
      chartData,
      historicalMetrics,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
