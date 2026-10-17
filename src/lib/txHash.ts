import crypto from "crypto";

/**
 * Deterministic transaction fingerprint based ONLY on date and description.
 * Amount and account are intentionally excluded so that re-uploaded rows match
 * already imported (and already categorised) transactions.
 *
 * Identical date+description rows within one batch are told apart by an
 * occurrence index (0, 1, 2 ...) in order of appearance. Pass the same
 * `tracker` object for every row of a batch.
 */
export function computeTxHash(
  date: Date,
  description: string,
  tracker: Record<string, number>
): string {
  const dateStr = date.toISOString().slice(0, 10);
  const descStr = (description || "").trim().toLowerCase();
  const key = `${dateStr}|${descStr}`;
  const occurrenceIndex = (tracker[key] = (tracker[key] ?? -1) + 1);
  return crypto
    .createHash("sha256")
    .update(`${dateStr}|${descStr}|${occurrenceIndex}`)
    .digest("hex");
}
