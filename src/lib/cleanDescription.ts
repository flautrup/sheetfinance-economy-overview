/**
 * Cleans bank-specific transaction prefixes, dates, and noise to extract the core merchant/payee name.
 * Examples:
 * - "Kortköp 260901 SPICY HOT L DDEK PIN" -> "SPICY HOT L DDEK"
 * - "Autogiro K*Tehuset Ja" -> "Tehuset Ja"
 * - "Betalning BG 5167-4562 SYDSKÅNES AV" -> "SYDSKÅNES AV"
 * - "PAYPAL *SPOTIFY" -> "SPOTIFY"
 * - "Swish betalning TEHUSET JAVA AKTIEB" -> "TEHUSET JAVA AKTIEB"
 */
export function cleanDescription(desc: string | null | undefined): string {
  if (!desc) return "";
  let s = desc.trim();

  // Remove card purchase date prefixes: "Kortköp 240901 ", "Kortkop 240901 "
  s = s.replace(/^kortk[öo]p\s+\d{6}\s*/i, "");

  // Remove ATM withdrawal date prefixes: "Kontantuttag 151030 "
  s = s.replace(/^kontantuttag\s+\d{6}\s*/i, "");

  // Remove Autogiro prefixes: "Autogiro K*", "Autogiro "
  s = s.replace(/^autogiro\s+(k\*)?\s*/i, "");

  // Remove Bankgiro/Plusgiro payment prefixes: "Betalning BG 123-4567 ", "BG 123-4567 ", "4784604-3 "
  s = s.replace(/^betalning\s+(bg|pg)\s+[\d\-]+\s*/i, "");
  s = s.replace(/^(bg|pg)\s+[\d\-]+\s*/i, "");
  s = s.replace(/^[\d]{3,8}-[\d]\s*/i, "");

  // Remove PayPal prefixes: "PAYPAL *", "Paypal *"
  s = s.replace(/^paypal\s*\*?\s*/i, "");

  // Remove Swish prefixes: "Swish betalning ", "Swish till ", "Swish från ", "Swish "
  s = s.replace(/^swish\s+(betalning|till|fr[åa]n)?\s*/i, "");

  // Remove trailing card terminal PIN or dates: " PIN", " 2024-09-01"
  s = s.replace(/\s+pin\s*$/i, "");
  s = s.replace(/\s+\d{4}-\d{2}-\d{2}\s*$/, "");

  return s.trim();
}

/**
 * Extracts a concise search keyword/phrase (up to 3 words) from a cleaned merchant string.
 */
export function getMerchantKeyword(cleaned: string): string {
  if (!cleaned) return "";
  const words = cleaned.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length <= 2) return cleaned;
  return words.slice(0, 2).join(" ");
}
