const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function backfill() {
  console.log("Starting hash backfill for existing transactions...");
  
  // Fetch all transactions ordered chronologically
  const transactions = await prisma.transaction.findMany({
    select: {
      id: true,
      date: true,
      amount: true,
      description: true,
      account: true,
      hash: true
    },
    orderBy: [
      { date: "asc" },
      { createdAt: "asc" },
      { id: "asc" }
    ]
  });

  console.log(`Loaded ${transactions.length} transactions from database.`);

  const occurrenceTracker = {};
  const updates = [];

  for (const t of transactions) {
    const dateStr = t.date instanceof Date ? t.date.toISOString().slice(0, 10) : String(t.date).slice(0, 10);
    const descStr = (t.description || "").trim().toLowerCase();

    // Hash = date + description + occurrence index (amount/account intentionally excluded)
    const occurrenceKey = `${dateStr}|${descStr}`;
    const occurrenceIndex = (occurrenceTracker[occurrenceKey] = (occurrenceTracker[occurrenceKey] ?? -1) + 1);

    const hash = crypto
      .createHash("sha256")
      .update(`${dateStr}|${descStr}|${occurrenceIndex}`)
      .digest("hex");

    if (t.hash !== hash) {
      updates.push({ id: t.id, hash });
    }
  }

  console.log(`Computed hashes. ${updates.length} records need hash updates.`);

  // Update in batches inside transactions
  const BATCH_SIZE = 500;
  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE);
    await prisma.$transaction(
      batch.map(item =>
        prisma.transaction.update({
          where: { id: item.id },
          data: { hash: item.hash }
        })
      )
    );
    console.log(`Processed ${Math.min(i + BATCH_SIZE, updates.length)} / ${updates.length}...`);
  }

  console.log("Hash backfill completed successfully!");
}

backfill()
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
