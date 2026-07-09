import { prisma } from "@/lib/prisma";

export interface BalanceSummary {
  date: Date;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidCapital: number;
}

/**
 * Get all unique balance dates, sorted descending (latest first).
 */
export async function getUniqueBalanceDates(): Promise<Date[]> {
  const dates = await prisma.balance.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" },
  });
  return dates.map((d) => d.date);
}

/**
 * Fetch balances for a specific date (or the latest date) and aggregate them into a summary.
 */
export async function getBalanceSummary(targetDate?: Date): Promise<BalanceSummary | null> {
  let dateQuery = targetDate;

  if (!dateQuery) {
    const latest = await prisma.balance.findFirst({
      orderBy: { date: "desc" },
    });
    if (!latest) return null;
    dateQuery = latest.date;
  }

  const balances = await prisma.balance.findMany({
    where: { date: dateQuery },
  });

  const mappings = await prisma.bucketMapping.findMany();
  const bucketByDesc: Record<string, string> = {};
  mappings.forEach((m) => {
    bucketByDesc[m.balanceDescription] = m.bucket;
  });

  let totalAssets = 0;
  let totalLiabilities = 0;
  let liquidCapital = 0;

  balances.forEach((bal) => {
    const value = bal.value;
    const isDebt = bal.type?.toLowerCase().includes("skuld") || bal.type?.toLowerCase() === "skulder";
    const isAsset = bal.type?.toLowerCase().includes("tillgång") || bal.type?.toLowerCase() === "tillgångar";

    if (isDebt) {
      totalLiabilities += Math.abs(value);
    } else if (isAsset) {
      totalAssets += value;
    }

    // Liquid Capital calculations (mapped to BUFFER or PRESERVE)
    const desc = bal.description || "";
    const bucket = bucketByDesc[desc];
    if (bucket === "BUFFER" || bucket === "PRESERVE") {
      const netVal = isDebt ? -Math.abs(value) : value;
      liquidCapital += netVal;
    }
  });

  return {
    date: dateQuery,
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    liquidCapital,
  };
}

/**
 * Calculate the average monthly expenses over a trailing window from a given date.
 */
export async function getAverageMonthlyExpenses(
  toDate: Date,
  monthsWindow: number = 6
): Promise<{ avgMonthlyExpenses: number; estimated: boolean }> {
  const fromDate = new Date(toDate);
  fromDate.setMonth(fromDate.getMonth() - monthsWindow);

  // 1. Fetch total expenses in the window
  const expensesAggregate = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      date: { gte: fromDate, lte: toDate },
      area: "Utgift",
      AND: [
        { OR: [{ transferFrom: "" }, { transferFrom: null }] },
        { OR: [{ transferTo: "" }, { transferTo: null }] },
      ],
    },
  });

  const totalExpense = Math.abs(expensesAggregate._sum?.amount || 0);
  const avg = totalExpense / monthsWindow;

  // 2. Fallback check: if there are no expenses in this window, check global fallback
  if (avg === 0) {
    const latestTx = await prisma.transaction.findFirst({
      where: { area: "Utgift" },
      orderBy: { date: "desc" },
    });

    if (latestTx) {
      const fallbackEnd = new Date(latestTx.date);
      const fallbackStart = new Date(fallbackEnd);
      fallbackStart.setMonth(fallbackStart.getMonth() - monthsWindow);

      const fallbackAggregate = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          date: { gte: fallbackStart, lte: fallbackEnd },
          area: "Utgift",
          AND: [
            { OR: [{ transferFrom: "" }, { transferFrom: null }] },
            { OR: [{ transferTo: "" }, { transferTo: null }] },
          ],
        },
      });

      const totalFallback = Math.abs(fallbackAggregate._sum?.amount || 0);
      return {
        avgMonthlyExpenses: totalFallback / monthsWindow,
        estimated: true,
      };
    }
  }

  return {
    avgMonthlyExpenses: avg,
    estimated: false,
  };
}

/**
 * Calculate the rolling savings rate over a trailing year from the latest transaction date.
 */
export async function getSavingsRate(monthsWindow: number = 12): Promise<number> {
  const latestTx = await prisma.transaction.findFirst({
    where: { area: { in: ["Utgift", "Inkomst"] } },
    orderBy: { date: "desc" },
  });

  const toDate = latestTx ? new Date(latestTx.date) : new Date();
  const fromDate = new Date(toDate);
  fromDate.setMonth(fromDate.getMonth() - monthsWindow);

  const transactions = await prisma.transaction.findMany({
    where: {
      date: { gte: fromDate, lte: toDate },
      area: { in: ["Utgift", "Inkomst"] },
      AND: [
        { OR: [{ transferFrom: "" }, { transferFrom: null }] },
        { OR: [{ transferTo: "" }, { transferTo: null }] },
      ],
    },
  });

  const totalIncome = transactions.reduce(
    (acc, t) => acc + (t.area === "Inkomst" ? Math.abs(t.amount) : 0),
    0
  );
  const totalExpenses = transactions.reduce(
    (acc, t) => acc + (t.area === "Utgift" ? Math.abs(t.amount) : 0),
    0
  );

  return totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
}
