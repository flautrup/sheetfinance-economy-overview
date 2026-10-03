"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { useSession, signIn } from "next-auth/react";
import Papa from "papaparse";

export default function UploadPage() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  
  // States for existing Google Sheet Import
  const [txSheetUrl, setTxSheetUrl] = useState("");
  const [balSheetUrl, setBalSheetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

interface CategorizedTransaction {
  date: string;
  description: string;
  amount: number;
  area: string;
  type: string;
  category: string;
}

  // States for AI Categorization
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [parsedTransactions, setParsedTransactions] = useState<CategorizedTransaction[]>([]);
  const [isSavingAi, setIsSavingAi] = useState(false);
  const [accountOwner, setAccountOwner] = useState("");
  
  // States for Export
  const [exportSheetUrl, setExportSheetUrl] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Google Sheets Import
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txSheetUrl, balSheetUrl, accessToken: (session as { accessToken?: string }).accessToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch from Google Sheets");
      
      setMessage(`${t("dataSaved")} (Transaktioner: ${data.txCount}, Balans: ${data.balCount})`);
      setTxSheetUrl("");
      setBalSheetUrl("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setMessage(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. CSV Parsing & AI Categorization
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("");
    setIsCategorizing(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // Attempt to guess columns (Date, Description, Amount)
        // This is a naive mapper, it looks for common Swedish bank column names
        const rawTxs = (results.data as Record<string, string | undefined>[]).map((row) => {
          const date = row["Datum"] || row["Date"] || row["Bokföringsdag"] || Object.values(row)[0];
          const desc = row["Beskrivning"] || row["Text"] || row["Description"] || row["Rubrik"] || Object.values(row)[1];
          const amtStr = row["Belopp"] || row["Amount"] || Object.values(row)[2];
          
          let amount = 0;
          if (amtStr && typeof amtStr === "string") {
            amount = parseFloat(amtStr.replace(/\s/g, "").replace(",", "."));
          } else if (typeof amtStr === "number") {
            amount = amtStr;
          }

          return { date: date || "", description: desc || "", amount };
        }).filter(t => t.date && t.description && !isNaN(t.amount));

        try {
          const res = await fetch("/api/categorize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactions: rawTxs })
          });
          
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          
          setParsedTransactions(data.transactions);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          setMessage(`AI Categorization Failed: ${message}`);
        } finally {
          setIsCategorizing(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
    });
  };

  const [taxonomy, setTaxonomy] = useState<Record<string, Record<string, string[]>>>({});

  useEffect(() => {
    fetch("/api/buckets/taxonomy")
      .then((res) => res.json())
      .then((data) => {
        if (data.taxonomy) {
          setTaxonomy(data.taxonomy);
        }
      });
  }, []);

  const handleTypeChange = (index: number, newArea: string, newType: string) => {
    const updated = [...parsedTransactions];
    updated[index].area = newArea;
    updated[index].type = newType;
    // Auto-select the first available category in this type
    const availableCategories = taxonomy[newArea]?.[newType] || [];
    updated[index].category = availableCategories[0] || "";
    setParsedTransactions(updated);
  };

  const handleCategoryChange = (index: number, newCategory: string) => {
    const updated = [...parsedTransactions];
    updated[index].category = newCategory;
    setParsedTransactions(updated);
  };

  const saveCategorizedTransactions = async () => {
    setIsSavingAi(true);
    try {
      const finalTxs = parsedTransactions.map(tx => ({
        ...tx,
        account: accountOwner || "Standardkonto"
      }));

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: finalTxs })
      });
      if (!res.ok) throw new Error("Misslyckades att spara transaktioner");
      
      setMessage(`Sparade ${parsedTransactions.length} transaktioner i databasen.`);
      setParsedTransactions([]);
      setAccountOwner("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setMessage(`Fel: ${message}`);
    } finally {
      setIsSavingAi(false);
    }
  };

  // 3. Export to Google Sheets
  const handleExport = async () => {
    if (!session) return;
    setIsExporting(true);
    setMessage("");

    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetUrl: exportSheetUrl, accessToken: (session as { accessToken?: string }).accessToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Misslyckades med exportering");
      
      setMessage(`Export lyckades! ${data.rowsExported} rader sparades till ditt ark.`);
      setExportSheetUrl("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setMessage(`Export Error: ${message}`);
    } finally {
      setIsExporting(false);
    }
  };

  if (status === "loading") return <div className="p-10">Laddar...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">
          Datahantering
        </h2>
        <p className="text-on-surface-variant font-medium mt-1">
          Ladda upp, kategorisera med AI, importera och exportera.
        </p>
      </header>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl font-medium">
          {message}
        </div>
      )}

      {!session ? (
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient text-center">
          <p className="text-sm font-bold text-on-surface mb-6">För att använda Google Sheets-funktionerna krävs inloggning med Google</p>
          <button onClick={() => signIn("google")} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow font-medium">
            Logga in med Google
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* AI Categorization Upload */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient border-t-4 border-primary">
            <h3 className="text-xl font-bold font-headline mb-2">Automagisk AI-kategorisering</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Ladda ner transaktioner från din bank som CSV. Släpp filen här så kategoriserar vår AI dem automatiskt utifrån din taxanomi.
            </p>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isCategorizing}
              />
              <span className="material-symbols-outlined text-4xl text-primary mb-2 block">upload_file</span>
              <p className="font-bold text-on-surface">Klicka eller dra och släpp CSV-fil här</p>
              {isCategorizing && <p className="text-primary mt-2 font-bold animate-pulse">AI analyserar och kategoriserar transaktioner...</p>}
            </div>
          </div>

          {/* Export Backup */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient border-t-4 border-amber-500">
            <h3 className="text-xl font-bold font-headline mb-2">Exportera Backup</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Spara alla dina transaktioner från databasen tillbaka till ett tomt Google Sheet som backup.
            </p>
            
            <label className="block text-xs font-bold text-on-surface uppercase tracking-widest mb-2">
              Mål-Sheet URL
            </label>
            <input
              type="text"
              className="w-full p-3 bg-surface-container-low border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm mb-4"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={exportSheetUrl}
              onChange={(e) => setExportSheetUrl(e.target.value)}
            />
            <button
              onClick={handleExport}
              disabled={isExporting || !exportSheetUrl}
              className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-lg shadow-sm hover:bg-amber-600 disabled:opacity-50 transition-colors w-full"
            >
              {isExporting ? "Exporterar..." : "Kör Backup"}
            </button>
          </div>

          {/* Traditional Sheet Import */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient col-span-1 lg:col-span-2 border-t-4 border-slate-400">
            <h3 className="text-xl font-bold font-headline mb-2">Klassisk Google Sheet Import</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Hämta transaktioner och balansräkning direkt från dina befintliga ark.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-widest mb-2">
                  Transaktioner URL
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-surface-container-low border border-slate-200 rounded-lg outline-none text-sm"
                  value={txSheetUrl}
                  onChange={(e) => setTxSheetUrl(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-widest mb-2">
                  Balansräkning URL
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-surface-container-low border border-slate-200 rounded-lg outline-none text-sm"
                  value={balSheetUrl}
                  onChange={(e) => setBalSheetUrl(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || (!txSheetUrl && !balSheetUrl)}
                className="px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {isSubmitting ? "Hämtar..." : "Importera Ark"}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* AI Refinement UI */}
      {parsedTransactions.length > 0 && (
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient border-2 border-primary">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold font-headline text-on-surface">Granska AI-kategorisering</h3>
              <p className="text-sm text-on-surface-variant">Här är AI:ns förslag. Justera vid behov och spara.</p>
            </div>
          </div>
          
          <div className="flex justify-between items-end mb-6 bg-surface-container-low p-4 rounded-xl">
            <div className="w-1/3">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-widest mb-2">
                Konto / Ägare
              </label>
              <input 
                type="text" 
                value={accountOwner}
                onChange={(e) => setAccountOwner(e.target.value)}
                placeholder="T.ex. Fredriks Swedbank"
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm shadow-sm"
              />
            </div>
            <button 
              onClick={saveCategorizedTransactions}
              disabled={isSavingAi}
              className="px-8 py-3 gradient-primary text-white font-bold rounded-lg shadow-ambient hover:scale-95 transition-all disabled:opacity-50"
            >
              {isSavingAi ? "Sparar..." : "Spara till Databas"}
            </button>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-container-lowest z-10">
                <tr className="border-b border-surface-variant text-xs uppercase tracking-widest text-on-surface-variant">
                  <th className="p-4 font-bold">Datum</th>
                  <th className="p-4 font-bold">Beskrivning</th>
                  <th className="p-4 font-bold">Belopp</th>
                  <th className="p-4 font-bold">Typ & Kategori</th>
                </tr>
              </thead>
              <tbody>
                {parsedTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-b border-surface-container hover:bg-surface-container-low transition-colors text-sm">
                    <td className="p-4 whitespace-nowrap font-medium">{tx.date}</td>
                    <td className="p-4 text-on-surface-variant">{tx.description}</td>
                    <td className={`p-4 font-bold ${tx.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {tx.amount} kr
                    </td>
                    <td className="p-4 flex flex-col gap-2">
                      <select 
                        value={`${tx.area}|${tx.type}`}
                        onChange={(e) => {
                          const [newArea, newType] = e.target.value.split('|');
                          handleTypeChange(idx, newArea, newType);
                        }}
                        className="p-2 border border-slate-200 rounded bg-white text-sm w-full outline-primary cursor-pointer"
                      >
                        {Object.entries(taxonomy).map(([area, typesObj]) => (
                          <optgroup key={area} label={area}>
                            {Object.keys(typesObj).map(typeKey => (
                              <option key={`${area}|${typeKey}`} value={`${area}|${typeKey}`}>{typeKey}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      
                      <select
                        value={tx.category}
                        onChange={(e) => handleCategoryChange(idx, e.target.value)}
                        className="p-2 border border-slate-200 rounded bg-white text-sm w-full outline-primary cursor-pointer"
                      >
                        {(taxonomy[tx.area]?.[tx.type] || []).map((cat: string) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
