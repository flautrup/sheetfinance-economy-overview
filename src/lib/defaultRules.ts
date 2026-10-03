export const defaultRules = [
  // Media & Streaming
  { keyword: "netflix", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
  { keyword: "spotify", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
  { keyword: "hbo", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
  { keyword: "disney", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
  { keyword: "youtube", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
  { keyword: "storytel", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
  { keyword: "bookbeat", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
  { keyword: "viaplay", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },

  // Groceries (Livsmedel)
  { keyword: "ica", area: "Utgift", type: "Mat & dryck", category: "Livsmedel" },
  { keyword: "coop", area: "Utgift", type: "Mat & dryck", category: "Livsmedel" },
  { keyword: "willys", area: "Utgift", type: "Mat & dryck", category: "Livsmedel" },
  { keyword: "lidl", area: "Utgift", type: "Mat & dryck", category: "Livsmedel" },
  { keyword: "hemköp", area: "Utgift", type: "Mat & dryck", category: "Livsmedel" },
  { keyword: "city gross", area: "Utgift", type: "Mat & dryck", category: "Livsmedel" },
  { keyword: "mathem", area: "Utgift", type: "Mat & dryck", category: "Livsmedel" },

  // Fast Food & Snacks
  { keyword: "mcdonald", area: "Utgift", type: "Mat & dryck", category: "Snabbmat" },
  { keyword: "burger king", area: "Utgift", type: "Mat & dryck", category: "Snabbmat" },
  { keyword: "max hamburg", area: "Utgift", type: "Mat & dryck", category: "Snabbmat" },
  { keyword: "kfc", area: "Utgift", type: "Mat & dryck", category: "Snabbmat" },
  { keyword: "subway", area: "Utgift", type: "Mat & dryck", category: "Snabbmat" },
  { keyword: "sushi", area: "Utgift", type: "Mat & dryck", category: "Snabbmat" },
  { keyword: "pizza", area: "Utgift", type: "Mat & dryck", category: "Snabbmat" },
  { keyword: "pressbyrån", area: "Utgift", type: "Mat & dryck", category: "Godis/Snacks" },
  { keyword: "7-eleven", area: "Utgift", type: "Mat & dryck", category: "Godis/Snacks" },

  // Cafes & Fika
  { keyword: "espresso house", area: "Utgift", type: "Mat & dryck", category: "Fika" },
  { keyword: "starbucks", area: "Utgift", type: "Mat & dryck", category: "Fika" },
  { keyword: "konditori", area: "Utgift", type: "Mat & dryck", category: "Fika" },
  { keyword: "bageri", area: "Utgift", type: "Mat & dryck", category: "Fika" },
  { keyword: "fika", area: "Utgift", type: "Mat & dryck", category: "Fika" },
  { keyword: "café", area: "Utgift", type: "Mat & dryck", category: "Fika" },

  // Alcohol
  { keyword: "systembolaget", area: "Utgift", type: "Mat & dryck", category: "Alkohol" },

  // Transport & Fuel
  { keyword: "circle k", area: "Utgift", type: "Transport", category: "Bränsle" },
  { keyword: "okq8", area: "Utgift", type: "Transport", category: "Bränsle" },
  { keyword: "preem", area: "Utgift", type: "Transport", category: "Bränsle" },
  { keyword: "st1", area: "Utgift", type: "Transport", category: "Bränsle" },
  { keyword: "ingo", area: "Utgift", type: "Transport", category: "Bränsle" },
  { keyword: "tanka", area: "Utgift", type: "Transport", category: "Bränsle" },
  { keyword: "drivmedel", area: "Utgift", type: "Transport", category: "Bränsle" },
  { keyword: "easypark", area: "Utgift", type: "Transport", category: "Parkering/Vägtullar" },
  { keyword: "parkman", area: "Utgift", type: "Transport", category: "Parkering/Vägtullar" },
  { keyword: "parkering", area: "Utgift", type: "Transport", category: "Parkering/Vägtullar" },
  { keyword: "transportstyrelsen", area: "Utgift", type: "Transport", category: "Parkering/Vägtullar" },
  { keyword: "sl res", area: "Utgift", type: "Transport", category: "Kollektivt" },
  { keyword: "sl biljett", area: "Utgift", type: "Transport", category: "Kollektivt" },
  { keyword: "sj ab", area: "Utgift", type: "Transport", category: "Kollektivt" },
  { keyword: "västtrafik", area: "Utgift", type: "Transport", category: "Kollektivt" },
  { keyword: "skånetrafiken", area: "Utgift", type: "Transport", category: "Kollektivt" },

  // Housing & Energy
  { keyword: "hyra", area: "Utgift", type: "Boende", category: "Hyra/Avgift" },
  { keyword: "brf", area: "Utgift", type: "Boende", category: "Hyra/Avgift" },
  { keyword: "samfällighet", area: "Utgift", type: "Boende", category: "Hyra/Avgift" },
  { keyword: "vattenfall", area: "Utgift", type: "Boende", category: "El" },
  { keyword: "ellevio", area: "Utgift", type: "Boende", category: "El" },
  { keyword: "e.on", area: "Utgift", type: "Boende", category: "El" },
  { keyword: "fortum", area: "Utgift", type: "Boende", category: "El" },
  { keyword: "tibber", area: "Utgift", type: "Boende", category: "El" },
  { keyword: "skellefteå kraft", area: "Utgift", type: "Boende", category: "El" },

  // Insurance
  { keyword: "folksam", area: "Utgift", type: "Försäkring", category: "Hem" },
  { keyword: "länsförsäkringar", area: "Utgift", type: "Försäkring", category: "Hem" },
  { keyword: "trygghansa", area: "Utgift", type: "Försäkring", category: "Hem" },
  { keyword: "if skade", area: "Utgift", type: "Försäkring", category: "Hem" },
  { keyword: "hedvig", area: "Utgift", type: "Försäkring", category: "Hem" },

  // Loans
  { keyword: "csn", area: "Utgift", type: "Lån", category: "Studielån" },
  { keyword: "bolån", area: "Utgift", type: "Lån", category: "Bolån" },
  { keyword: "sbab", area: "Utgift", type: "Lån", category: "Bolån" },

  // Income
  { keyword: "lön", area: "Inkomst", type: "Inkomst", category: "Lön" },
  { keyword: "salary", area: "Inkomst", type: "Inkomst", category: "Lön" },
  { keyword: "barnbidrag", area: "Inkomst", type: "Inkomst", category: "Barnbidrag" },
  { keyword: "försäkringskassan", area: "Inkomst", type: "Inkomst", category: "Föräldrapenning" },
  { keyword: "pension", area: "Inkomst", type: "Inkomst", category: "Pension" },

  // Transfers & Savings
  { keyword: "swish", area: "Överföring", type: "Överföring", category: "Sparande" },
  { keyword: "avanza", area: "Överföring", type: "Överföring", category: "Aktier" },
  { keyword: "nordnet", area: "Överföring", type: "Överföring", category: "Aktier" },
  { keyword: "överföring", area: "Överföring", type: "Överföring", category: "Bankkonto" },
  { keyword: "overforing", area: "Överföring", type: "Överföring", category: "Bankkonto" },
  { keyword: "insättning", area: "Överföring", type: "Överföring", category: "Bankkonto" }
];
