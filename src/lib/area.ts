/**
 * Canonical area names. Any spelling variant of the transfer area
 * ("Överföringar", "överföring", "Overforing" ...) is mapped to "Överföring"
 * so there is only ONE transfer option everywhere.
 */
export const TRANSFER_AREA = "Överföring";

export function normalizeArea(area: string | null | undefined): string {
  const a = (area || "").trim();
  const lower = a.toLowerCase();
  if (lower.startsWith("överf") || lower.startsWith("overf")) return TRANSFER_AREA;
  return a;
}
