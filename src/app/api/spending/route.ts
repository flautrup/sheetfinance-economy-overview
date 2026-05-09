import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Find the latest transaction date to determine the rolling window
    const latestTransaction = await prisma.transaction.findFirst({
      where: { area: { in: ["Utgift", "Inkomst"] } },
      orderBy: { date: 'desc' }
    });

    const oneYearAgo = latestTransaction ? new Date(latestTransaction.date) : new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setDate(1); // Start from the first of that month

    // Fetch transactions
    const rawTransactions = await prisma.transaction.findMany({
      where: {
        date: { gte: oneYearAgo },
        area: { in: ["Utgift", "Inkomst"] },
        AND: [
          { OR: [{ transferFrom: "" }, { transferFrom: null }] },
          { OR: [{ transferTo: "" }, { transferTo: null }] }
        ]
      },
      orderBy: { date: 'asc' }
    });

    const monthlyAggregate: Record<string, { income: number; expense: number }> = {};
    const categoryAggregate: Record<string, number> = {};
    
    // Grouping
    rawTransactions.forEach(t => {
      const monthKey = t.date.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyAggregate[monthKey]) {
        monthlyAggregate[monthKey] = { income: 0, expense: 0 };
      }

      const amount = Math.abs(t.amount);
      if (t.area === "Inkomst") {
        monthlyAggregate[monthKey].income += amount;
      } else {
        monthlyAggregate[monthKey].expense += amount;
        
        // Categorize expenses only
        const cat = t.category || "Ospecificerat";
        categoryAggregate[cat] = (categoryAggregate[cat] || 0) + amount;
      }
    });

    // Formatting for Recharts
    const chartData = Object.keys(monthlyAggregate).sort().map(month => ({
      name: month,
      income: monthlyAggregate[month].income,
      expense: monthlyAggregate[month].expense,
      surplus: monthlyAggregate[month].income - monthlyAggregate[month].expense
    }));

    // Top categories (sorted)
    const sortedCategories = Object.keys(categoryAggregate)
      .map(name => ({ name, amount: categoryAggregate[name] }))
      .sort((a, b) => b.amount - a.amount);

    const totalIncome = rawTransactions.reduce((acc, t) => acc + (t.area === "Inkomst" ? Math.abs(t.amount) : 0), 0);
    const totalExpenses = rawTransactions.reduce((acc, t) => acc + (t.area === "Utgift" ? Math.abs(t.amount) : 0), 0);
    
    const monthsCount = Object.keys(monthlyAggregate).length || 1;
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
      period: {
        start: oneYearAgo.toISOString().substring(0, 7),
        end: new Date().toISOString().substring(0, 7)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
