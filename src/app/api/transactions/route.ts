import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { transactions } = await req.json();

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    let insertedCount = 0;

    // Use a transaction to insert all
    await prisma.$transaction(async (tx) => {
      for (const t of transactions) {
        // Skip invalid rows
        if (!t.date || !t.description || typeof t.amount !== 'number') continue;

        // Try parsing the date
        const parsedDate = new Date(t.date);
        if (isNaN(parsedDate.getTime())) continue;

        // Deduplication: Check if identical transaction already exists
        const existing = await tx.transaction.findFirst({
          where: {
            date: parsedDate,
            description: String(t.description),
            amount: t.amount
          }
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
            // Since it's from bank CSV, we don't know the exact bucket mapping here,
            // we leave that to the categorization logic.
            transferFrom: "",
            transferTo: ""
          }
        });
        insertedCount++;
      }
    });

    return NextResponse.json({ success: true, count: insertedCount });
  } catch (error: any) {
    console.error("Save transactions error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
