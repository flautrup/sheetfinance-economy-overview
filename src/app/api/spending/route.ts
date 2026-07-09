import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // 1. Verify Session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    // Fetch all transaction dates to build the list of available months (YYYY-MM)
    const txDates = await prisma.transaction.findMany({
      select: { date: true },
      where: { area: { in: ["Utgift", "Inkomst"] } },
      orderBy: { date: "desc" },
    });

    const monthsSet = new Set<string>();
    txDates.forEach((t) => {
      monthsSet.add(t.date.toISOString().substring(0, 7));
    });
    const availableMonths = Array.from(monthsSet).sort().reverse(); // e.g. ["2024-05", "2024-04"]

    // Construct Date Filter
    let dateFilter: { gte: Date; lt?: Date };
    let isRolling = false;
    let periodStart = "";
    let periodEnd = "";

    if (yearParam) {
      let start: Date;
      let end: Date;
      if (monthParam) {
        start = new Date(`${yearParam}-${monthParam.padStart(2, "0")}-01T00:00:00.000Z`);
        end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        periodStart = `${yearParam}-${monthParam.padStart(2, "0")}`;
        periodEnd = periodStart;
      } else {
        start = new Date(`${yearParam}-01-01T00:00:00.000Z`);
        end = new Date(`${Number(yearParam) + 1}-01-01T00:00:00.000Z`);
        periodStart = `${yearParam}-01`;
        periodEnd = `${yearParam}-12`;
      }
      dateFilter = { gte: start, lt: end };
    } else {
      isRolling = true;
      // Default: rolling 12m from the latest transaction date
      const latestTransaction = await prisma.transaction.findFirst({
        where: { area: { in: ["Utgift", "Inkomst"] } },
        orderBy: { date: "desc" },
      });

      const oneYearAgo = latestTransaction ? new Date(latestTransaction.date) : new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      oneYearAgo.setDate(1); // Start from the 1st of that month

      dateFilter = { gte: oneYearAgo };
      periodStart = oneYearAgo.toISOString().substring(0, 7);
      periodEnd = latestTransaction ? latestTransaction.date.toISOString().substring(0, 7) : new Date().toISOString().substring(0, 7);
    }

    // Fetch transactions inside the filter period
    const rawTransactions = await prisma.transaction.findMany({
      where: {
        date: dateFilter,
        area: { in: ["Utgift", "Inkomst"] },
        AND: [
          { OR: [{ transferFrom: "" }, { transferFrom: null }] },
          { OR: [{ transferTo: "" }, { transferTo: null }] },
        ],
      },
      orderBy: { date: "asc" },
    });

    const monthlyAggregate: Record<string, { income: number; expense: number }> = {};
    const categoryAggregate: Record<string, number> = {};

    rawTransactions.forEach((t) => {
      const monthKey = t.date.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyAggregate[monthKey]) {
        monthlyAggregate[monthKey] = { income: 0, expense: 0 };
      }

      const amount = Math.abs(t.amount);
      if (t.area === "Inkomst") {
        monthlyAggregate[monthKey].income += amount;
      } else {
        monthlyAggregate[monthKey].expense += amount;
        const cat = t.category || "Ospecificerat";
        categoryAggregate[cat] = (categoryAggregate[cat] || 0) + amount;
      }
    });

    // Format for Recharts
    const chartData = Object.keys(monthlyAggregate)
      .sort()
      .map((month) => ({
        name: month,
        income: monthlyAggregate[month].income,
        expense: monthlyAggregate[month].expense,
        surplus: monthlyAggregate[month].income - monthlyAggregate[month].expense,
      }));

    // Top categories (sorted)
    const sortedCategories = Object.keys(categoryAggregate)
      .map((name) => ({ name, amount: categoryAggregate[name] }))
      .sort((a, b) => b.amount - a.amount);

    const totalIncome = rawTransactions.reduce(
      (acc, t) => acc + (t.area === "Inkomst" ? Math.abs(t.amount) : 0),
      0
    );
    const totalExpenses = rawTransactions.reduce(
      (acc, t) => acc + (t.area === "Utgift" ? Math.abs(t.amount) : 0),
      0
    );

    const monthsCount = isRolling ? (Object.keys(monthlyAggregate).length || 1) : 1;
    const averageSpending = totalExpenses / monthsCount;
    const averageIncome = totalIncome / monthsCount;

    return NextResponse.json({
      chartData,
      categories: sortedCategories,
      totalIncome,
      totalExpenses,
      averageSpending,
      averageIncome,
      totalSurplus: totalIncome - totalExpenses,
      availableMonths,
      period: {
        start: periodStart,
        end: periodEnd,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
