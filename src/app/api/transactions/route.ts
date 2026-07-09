import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const where: { category?: string; date?: { gte: Date; lt?: Date } } = {};
    if (category) {
      where.category = category;
    }

    // Filter by specific year/month
    if (year) {
      let start: Date;
      let end: Date;
      if (month) {
        start = new Date(`${year}-${month.padStart(2, "0")}-01T00:00:00.000Z`);
        end = new Date(start);
        end.setMonth(end.getMonth() + 1);
      } else {
        start = new Date(`${year}-01-01T00:00:00.000Z`);
        end = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
      }
      where.date = { gte: start, lt: end };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactions } = await req.json();

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    let insertedCount = 0;

    await prisma.$transaction(async (tx) => {
      for (const t of transactions) {
        if (!t.date || !t.description || typeof t.amount !== "number") continue;

        const parsedDate = new Date(t.date);
        if (isNaN(parsedDate.getTime())) continue;

        // Deduplication: check if identical transaction exists
        const existing = await tx.transaction.findFirst({
          where: {
            date: parsedDate,
            description: String(t.description),
            amount: t.amount,
          },
        });

        if (existing) continue;

        await tx.transaction.create({
          data: {
            date: parsedDate,
            description: String(t.description),
            amount: t.amount,
            area: t.area || "Utgift",
            type: t.type || "",
            category: t.category || "Övrigt",
            account: t.account || null,
            transferFrom: "",
            transferTo: "",
          },
        });
        insertedCount++;
      }
    });

    return NextResponse.json({ success: true, count: insertedCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Save transactions error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
