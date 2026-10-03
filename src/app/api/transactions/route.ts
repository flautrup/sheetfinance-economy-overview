import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const area = searchParams.get("area");
    const type = searchParams.get("type");
    const account = searchParams.get("account");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const all = searchParams.get("all") === "true";
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = (searchParams.get("sortOrder") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get("pageSize") || "50", 10)));

    const where: Prisma.TransactionWhereInput = {};
    if (category) where.category = category;
    if (area) where.area = area;
    if (type) where.type = type;
    if (account) where.account = account;

    if (search) {
      where.OR = [
        { description: { contains: search } },
        { note: { contains: search } },
        { account: { contains: search } },
      ];
    }

    if (startDate || endDate) {
      const dateFilter: Prisma.DateTimeFilter = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
      }
      where.date = dateFilter;
    } else if (year) {
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

    const validSortFields = ["date", "amount", "description", "category", "area", "type", "account"];
    const orderField = validSortFields.includes(sortBy) ? sortBy : "date";

    const totalCount = await prisma.transaction.count({ where });
    const sumAgg = await prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
    });

    const queryOptions: Prisma.TransactionFindManyArgs = {
      where,
      orderBy: { [orderField]: sortOrder },
    };

    if (!all) {
      queryOptions.skip = (page - 1) * pageSize;
      queryOptions.take = pageSize;
    } else {
      queryOptions.take = 1000;
    }

    const transactions = await prisma.transaction.findMany(queryOptions);

    return NextResponse.json({
      transactions,
      totalCount,
      totalSum: sumAgg._sum.amount ?? 0,
      page: all ? 1 : page,
      pageSize: all ? transactions.length : pageSize,
      totalPages: all ? 1 : Math.ceil(totalCount / pageSize),
    });
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

    // Prepare candidate records and calculate deterministic hashes
    const occurrenceTracker: Record<string, number> = {};
    const candidateTransactions = [];

    for (const t of transactions) {
      if (!t.date || !t.description || typeof t.amount !== "number") continue;

      const parsedDate = new Date(t.date);
      if (isNaN(parsedDate.getTime())) continue;

      const dateStr = parsedDate.toISOString().slice(0, 10);
      const descStr = String(t.description).trim().toLowerCase();
      const accStr = (t.account || "").trim().toLowerCase();
      const amountVal = Number(t.amount);

      let hash: string;
      if (t.reference || t.saldo !== undefined) {
        const refOrSaldo = String(t.reference ?? t.saldo).trim();
        hash = crypto
          .createHash("sha256")
          .update(`${dateStr}|${amountVal}|${descStr}|${accStr}|${refOrSaldo}`)
          .digest("hex");
      } else {
        const occurrenceKey = `${dateStr}|${amountVal}|${descStr}|${accStr}`;
        const occurrenceIndex = (occurrenceTracker[occurrenceKey] = (occurrenceTracker[occurrenceKey] ?? -1) + 1);
        hash = crypto
          .createHash("sha256")
          .update(`${dateStr}|${amountVal}|${descStr}|${accStr}|${occurrenceIndex}`)
          .digest("hex");
      }

      candidateTransactions.push({
        hash,
        date: parsedDate,
        description: String(t.description).trim(),
        amount: amountVal,
        area: t.area || "Utgift",
        type: t.type || "",
        category: t.category || "Övrigt",
        account: t.account ? String(t.account).trim() : null,
        transferFrom: t.transferFrom || "",
        transferTo: t.transferTo || "",
        note: t.note || null,
      });
    }

    if (candidateTransactions.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // 1. Batch lookup of existing hashes in a single O(1) query
    const candidateHashes = candidateTransactions.map((t) => t.hash);
    const existingRows = await prisma.transaction.findMany({
      where: { hash: { in: candidateHashes } },
      select: { hash: true },
    });

    const existingHashSet = new Set(existingRows.map((r) => r.hash));

    // 2. Filter out already-imported transactions
    const toInsert = candidateTransactions.filter((t) => !existingHashSet.has(t.hash));

    if (toInsert.length > 0) {
      // 3. Single batch insert
      await prisma.transaction.createMany({
        data: toInsert,
      });
    }

    return NextResponse.json({ success: true, count: toInsert.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Save transactions error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, area, category, type, description, note, account, amount, date } = body;

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const updateData: Prisma.TransactionUpdateInput = {};
    if (area !== undefined) updateData.area = area;
    if (category !== undefined) updateData.category = category;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (note !== undefined) updateData.note = note;
    if (account !== undefined) updateData.account = account;
    if (amount !== undefined) updateData.amount = Number(amount);
    if (date !== undefined) updateData.date = new Date(date);

    const updated = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    // Record user correction for self-learning if category/area/type changed
    const targetDesc = (updateData.description as string) || existing.description;
    const targetCat = (updateData.category as string) || existing.category;
    const targetArea = (updateData.area as string) || existing.area;
    const targetType = (updateData.type as string) || existing.type;

    if (
      targetDesc &&
      (updateData.category || updateData.area || updateData.type) &&
      (updateData.category !== existing.category || updateData.area !== existing.area || updateData.type !== existing.type)
    ) {
      try {
        await prisma.userCorrection.upsert({
          where: { description: targetDesc },
          update: {
            correctedArea: targetArea || "Utgift",
            correctedType: targetType || "",
            correctedCategory: targetCat || "Övrigt",
            usageCount: { increment: 1 },
          },
          create: {
            description: targetDesc,
            correctedArea: targetArea || "Utgift",
            correctedType: targetType || "",
            correctedCategory: targetCat || "Övrigt",
            usageCount: 1,
          },
        });
      } catch (corrErr) {
        console.warn("Failed to record correction during PATCH:", corrErr);
      }
    }

    return NextResponse.json({ success: true, transaction: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids, id } = await req.json();
    const targetIds = ids && Array.isArray(ids) ? ids : id ? [id] : [];

    if (targetIds.length === 0) {
      return NextResponse.json({ error: "No transaction IDs provided" }, { status: 400 });
    }

    const result = await prisma.transaction.deleteMany({
      where: { id: { in: targetIds } },
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
