interface PreClassification {
  area: string;
  type: string;
  category: string;
}

const CLASSIFICATION_RULES: { regex: RegExp; class: PreClassification }[] = [
  // Communications & Media
  { regex: /netflix|spotify|hbo|disney|youtube premium|storytel|bookbeat/i, class: { area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" } },
  
  // Grocery Stores
  { regex: /ica\s|ica-|coop|willys|lidl|hemköp|hemkop|city\s?gross|mathem/i, class: { area: "Utgift", type: "Mat & dryck", category: "Livsmedel" } },
  
  // Fast Food & Snacks
  { regex: /mcdonald|burger\s?king|max\s?hamburg|kfc|subway|pizza|sushi/i, class: { area: "Utgift", type: "Mat & dryck", category: "Snabbmat" } },
  { regex: /pressbyrån|pressbyran|7-eleven|okq8|circle\s?k|preem|shell|qstar/i, class: { area: "Utgift", type: "Mat & dryck", category: "Godis/Snacks" } },
  
  // Cafes & Fika
  { regex: /espresso\s?house|starbucks|konditori|fika|bageri|café|cafe/i, class: { area: "Utgift", type: "Mat & dryck", category: "Fika" } },
  
  // Systembolaget (Alcohol)
  { regex: /systembolaget/i, class: { area: "Utgift", type: "Mat & dryck", category: "Alkohol" } },
  
  // Transport & Fuel
  { regex: /drivmedel|tanka|bränsle|easypark|parkering|vägtull|samtrafiken|sl\sres|sj\sab/i, class: { area: "Utgift", type: "Transport", category: "Annat" } },
  
  // Clothing & Shopping
  { regex: /h&m|zara|zalando|asos|stadium|intersport|ikea|mio\s/i, class: { area: "Utgift", type: "Nöjen/Shopping", category: "Kläder/Skor" } },
  
  // Rent & Utilities
  { regex: /hyra|brf|samfällighet/i, class: { area: "Utgift", type: "Boende", category: "Hyra/Avgift" } },
  { regex: /vattenfall|ellevio|e\.on|fortum|skellefteå\skraft/i, class: { area: "Utgift", type: "Boende", category: "El" } },
  
  // Insurance
  { regex: /folksam|länsförsäkringar|lansforsakringar|if\sskade|trygghansa/i, class: { area: "Utgift", type: "Försäkring", category: "Hem" } },
  
  // Loans
  { regex: /csn|bolån|studielån/i, class: { area: "Utgift", type: "Lån", category: "Studielån" } },
  
  // Transfers
  { regex: /överföring|overforing|swish|insättning/i, class: { area: "Överföring", type: "Överföring", category: "Övrigt" } },
  
  // Incomes
  { regex: /lön|salary|pension|studiebidrag|barnbidrag/i, class: { area: "Inkomst", type: "Inkomst", category: "Lön" } }
];

/**
 * Attempt to classify a transaction description using regex rules locally.
 */
export function preClassify(description: string): PreClassification | null {
  if (!description) return null;

  for (const rule of CLASSIFICATION_RULES) {
    if (rule.regex.test(description)) {
      return rule.class;
    }
  }

  return null;
}
