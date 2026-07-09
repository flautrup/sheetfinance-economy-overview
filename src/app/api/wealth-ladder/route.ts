import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getBalanceSummary, getAverageMonthlyExpenses } from "@/lib/finance";

export async function GET() {
  try {
    // 1. Verify Session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch Balance Summary details
    const summary = await getBalanceSummary();
    if (!summary) {
      return NextResponse.json({
        netWorth: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        liquidCapital: 0,
        monthlyPassiveIncome: 0,
        avgMonthlyExpenses: 0,
      });
    }

    const { netWorth, totalAssets, totalLiabilities, liquidCapital } = summary;
    const yearlyPassiveIncome = Math.max(0, netWorth) * 0.04; // 4% Rule
    const monthlyPassiveIncome = yearlyPassiveIncome / 12;

    // 3. Trailing monthly expenses (using 12-month rolling window for wealth ladder metrics)
    const { avgMonthlyExpenses } = await getAverageMonthlyExpenses(summary.date, 12);

    return NextResponse.json({
      netWorth,
      totalAssets,
      totalLiabilities,
      liquidCapital,
      monthlyPassiveIncome,
      avgMonthlyExpenses: Math.max(avgMonthlyExpenses, 1), // Avoid div by 0 in frontend UI calculations
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
