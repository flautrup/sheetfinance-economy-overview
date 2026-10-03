"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "sv" | "en";

export const translations = {
  sv: {
    dashboard: "Översikt",
    fourBuckets: "Fyra Hinkar",
    wealthLadder: "Rikedomstrappan",
    spending: "Månadens Utgifter",
    upload: "Ladda upp data",
    bufferBucket: "Bufferhinken",
    preserveBucket: "Bevara-värdet-hinken",
    growthBucket: "Tillväxthinken",
    playBucket: "Lekhinken",
    totalAssets: "Totalt Kapital",
    netWorth: "Förmögenhet",
    savingsRate: "Sparkvot",
    growthTrajectory: "Värdeutveckling",
    importData: "Importera Data",
    pasteTransactions: "Klistra in Transaktioner (från Google Sheets)",
    pasteBalances: "Klistra in Balansräkning (från Google Sheets)",
    saveData: "Spara Data",
    dataSaved: "Data sparades framgångsrikt!",
    saving: "Sparar...",
    transactions: "Transaktioner"
  },
  en: {
    dashboard: "Dashboard",
    fourBuckets: "Four Bucket Model",
    wealthLadder: "Wealth Ladder",
    spending: "Monthly Spending",
    upload: "Upload Data",
    bufferBucket: "Buffer Bucket",
    preserveBucket: "Preserve Bucket",
    growthBucket: "Growth Bucket",
    playBucket: "Play Bucket",
    totalAssets: "Total Assets",
    netWorth: "Net Worth",
    savingsRate: "Savings Rate",
    growthTrajectory: "Growth Trajectory",
    importData: "Import Data",
    pasteTransactions: "Paste Transactions (from Google Sheets)",
    pasteBalances: "Paste Balances (from Google Sheets)",
    saveData: "Save Data",
    dataSaved: "Data saved successfully!",
    saving: "Saving...",
    transactions: "Transactions"
  }
};

type Translations = typeof translations.sv;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("sv"); // Default to Swedish

  const t = (key: keyof Translations) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
