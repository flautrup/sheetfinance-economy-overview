"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";

interface Transaction {
  id: string;
  hash: string | null;
  date: string;
  area: string | null;
  type: string | null;
  category: string | null;
  description: string | null;
  account: string | null;
  transferFrom: string | null;
  transferTo: string | null;
  amount: number;
  note: string | null;
  createdAt: string;
}

interface TaxonomyData {
  [area: string]: {
    [type: string]: string[];
  };
}

export default function TransactionsPage() {
  const { t } = useTranslation();

  // Transactions & Pagination State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  // Filter & Search State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Taxonomy for cascading dropdowns
  const [taxonomy, setTaxonomy] = useState<TaxonomyData>({});

  // Selection & Batch Action State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal States
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [inspectTx, setInspectTx] = useState<Transaction | null>(null);
  const [batchCategoryModal, setBatchCategoryModal] = useState(false);
  const [batchArea, setBatchArea] = useState("Utgift");
  const [batchType, setBatchType] = useState("");
  const [batchCategory, setBatchCategory] = useState("");
  const [isBatchSaving, setIsBatchSaving] = useState(false);

  // Status feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Load taxonomy once
  useEffect(() => {
    fetch("/api/buckets/taxonomy")
      .then((res) => res.json())
      .then((data) => {
        if (data.taxonomy) {
          setTaxonomy(data.taxonomy);
        }
      })
      .catch((err) => console.error("Failed to load taxonomy:", err));
  }, []);

  // Fetch transactions on filter/pagination changes
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (selectedArea) params.set("area", selectedArea);
      if (selectedType) params.set("type", selectedType);
      if (selectedCategory) params.set("category", selectedCategory);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      if (!res.ok) throw new Error("Kunde inte hämta transaktioner");
      const data = await res.json();

      setTransactions(data.transactions || []);
      setTotalCount(data.totalCount || 0);
      setTotalSum(data.totalSum || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setFeedbackMessage("Ett fel uppstod vid hämtning av transaktioner.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortOrder, debouncedSearch, selectedArea, selectedType, selectedCategory, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter clear helper
  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedArea("");
    setSelectedType("");
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    setSortBy("date");
    setSortOrder("desc");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch || selectedArea || selectedType || selectedCategory || startDate || endDate
  );

  // Available options derived from taxonomy
  const availableAreas = useMemo(() => Object.keys(taxonomy), [taxonomy]);
  const availableTypes = useMemo(() => {
    if (!selectedArea || !taxonomy[selectedArea]) return [];
    return Object.keys(taxonomy[selectedArea]);
  }, [taxonomy, selectedArea]);
  const availableCategories = useMemo(() => {
    if (!selectedArea || !selectedType || !taxonomy[selectedArea]?.[selectedType]) {
      // If only area is selected, collect all categories in that area
      if (selectedArea && taxonomy[selectedArea]) {
        return Array.from(
          new Set(Object.values(taxonomy[selectedArea]).flatMap((cats) => cats))
        );
      }
      return [];
    }
    return taxonomy[selectedArea][selectedType];
  }, [taxonomy, selectedArea, selectedType]);

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedIds.size === transactions.length && transactions.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map((t) => t.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Delete transactions
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const confirm = window.confirm(
      `Är du säker på att du vill radera ${selectedIds.size} markerade transaktioner?`
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if (!res.ok) throw new Error("Kunde inte radera transaktioner");
      const data = await res.json();
      setFeedbackMessage(`Raderade ${data.count} transaktioner.`);
      setSelectedIds(new Set());
      fetchTransactions();
    } catch {
      setFeedbackMessage("Misslyckades att radera transaktioner.");
    }
  };

  const handleDeleteSingle = async (tx: Transaction) => {
    const confirm = window.confirm(`Radera transaktionen "${tx.description}" (${tx.amount} kr)?`);
    if (!confirm) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tx.id }),
      });
      if (!res.ok) throw new Error("Kunde inte radera transaktion");
      setFeedbackMessage("Transaktionen raderades.");
      fetchTransactions();
    } catch {
      setFeedbackMessage("Misslyckades att radera transaktion.");
    }
  };

  // Save Edit Transaction
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    setIsSavingEdit(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTx),
      });
      if (!res.ok) throw new Error("Kunde inte uppdatera transaktion");
      setFeedbackMessage("Transaktionen uppdaterades och AI-regler tränades med ditt val.");
      setEditingTx(null);
      fetchTransactions();
    } catch {
      setFeedbackMessage("Misslyckades att spara ändringar.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Batch Categorize Execution
  const handleBatchCategorize = async () => {
    if (selectedIds.size === 0 || !batchCategory) return;
    setIsBatchSaving(true);

    try {
      let count = 0;
      for (const id of Array.from(selectedIds)) {
        await fetch("/api/transactions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            area: batchArea,
            type: batchType,
            category: batchCategory,
          }),
        });
        count++;
      }

      setFeedbackMessage(`Kategoriserade ${count} transaktioner som ${batchCategory}.`);
      setBatchCategoryModal(false);
      setSelectedIds(new Set());
      fetchTransactions();
    } catch {
      setFeedbackMessage("Kunde inte uppdatera alla valda transaktioner.");
    } finally {
      setIsBatchSaving(false);
    }
  };

  const formatSEK = (val: number) => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface">
            {t("transactions")} & Huvudbok
          </h2>
          <p className="text-on-surface-variant text-sm font-medium mt-1">
            Hantera, sök, filtrera och granska transaktioner med SHA-256 fingeravtryck.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTransactions()}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container-high rounded-xl border border-outline-variant/30 text-xs font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Uppdatera
          </button>
        </div>
      </header>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-ambient border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Hittade Transaktioner</span>
            <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
          </div>
          <div className="text-2xl font-black font-headline text-on-surface">
            {totalCount.toLocaleString("sv-SE")}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            {hasActiveFilters ? "Filtrerat resultat" : "Totalt i databasen"}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-ambient border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Nettosumma</span>
            <span className="material-symbols-outlined text-emerald-600 text-xl">account_balance_wallet</span>
          </div>
          <div
            className={`text-2xl font-black font-headline ${
              totalSum < 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {formatSEK(totalSum)}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">Summa för aktuellt urval</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-ambient border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Aktiv Sida</span>
            <span className="material-symbols-outlined text-indigo-500 text-xl">auto_stories</span>
          </div>
          <div className="text-2xl font-black font-headline text-on-surface">
            {page} / {totalPages || 1}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Visar {transactions.length} rader per sida
          </p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-ambient border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Deduplicering</span>
            <span className="material-symbols-outlined text-amber-500 text-xl">fingerprint</span>
          </div>
          <div className="text-2xl font-black font-headline text-on-surface">
            SHA-256
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Förebygger identiska dubbletter
          </p>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-outline-variant/20 space-y-4">
        {/* Top Search & Reset Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Sök beskrivning, anteckning eller konto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">filter_alt_off</span>
              Rensa filter
            </button>
          )}
        </div>

        {/* Detailed Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Area Filter */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Område
            </label>
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setSelectedType("");
                setSelectedCategory("");
                setPage(1);
              }}
              className="w-full p-2 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Alla områden</option>
              {availableAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Typ
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedCategory("");
                setPage(1);
              }}
              disabled={!selectedArea}
              className="w-full p-2 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="">Alla typer</option>
              {availableTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Alla kategorier</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Från Datum
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full p-1.5 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Till Datum
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full p-1.5 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Floating Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4 sticky top-4 z-30 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              {selectedIds.size}
            </span>
            <span className="text-sm font-bold">
              {selectedIds.size === 1 ? "1 transaktion vald" : `${selectedIds.size} transaktioner valda`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBatchCategoryModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-sm">label</span>
              Ändra kategori
            </button>

            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Radera valda
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1.5"
            >
              Avmarkera alla
            </button>
          </div>
        </div>
      )}

      {/* Transactions Table Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low/70 border-b border-outline-variant/20 text-on-surface-variant uppercase tracking-wider font-bold">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      transactions.length > 0 && selectedIds.size === transactions.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </th>
                <th
                  onClick={() => {
                    if (sortBy === "date") {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    } else {
                      setSortBy("date");
                      setSortOrder("desc");
                    }
                  }}
                  className="p-3 cursor-pointer hover:text-on-surface"
                >
                  <div className="flex items-center gap-1">
                    <span>Datum</span>
                    {sortBy === "date" && (
                      <span className="material-symbols-outlined text-xs">
                        {sortOrder === "desc" ? "arrow_downward" : "arrow_upward"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortBy === "description") {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    } else {
                      setSortBy("description");
                      setSortOrder("asc");
                    }
                  }}
                  className="p-3 cursor-pointer hover:text-on-surface"
                >
                  <div className="flex items-center gap-1">
                    <span>Beskrivning</span>
                    {sortBy === "description" && (
                      <span className="material-symbols-outlined text-xs">
                        {sortOrder === "desc" ? "arrow_downward" : "arrow_upward"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Område / Typ</th>
                <th className="p-3">Konto</th>
                <th
                  onClick={() => {
                    if (sortBy === "amount") {
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    } else {
                      setSortBy("amount");
                      setSortOrder("desc");
                    }
                  }}
                  className="p-3 text-right cursor-pointer hover:text-on-surface"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Belopp</span>
                    {sortBy === "amount" && (
                      <span className="material-symbols-outlined text-xs">
                        {sortOrder === "desc" ? "arrow_downward" : "arrow_upward"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="p-3 text-center w-28">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-on-surface-variant font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-primary">
                        progress_activity
                      </span>
                      <span>Laddar transaktioner...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-3xl text-slate-300 block mb-2">
                      receipt_long
                    </span>
                    <p className="font-bold text-on-surface mb-1">Inga transaktioner hittades</p>
                    <p className="text-xs">Prova att justera eller rensa dina sökfilter.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isChecked = selectedIds.has(tx.id);
                  const isExpense = (tx.amount || 0) < 0;

                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-surface-container-low/50 transition-colors ${
                        isChecked ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(tx.id)}
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                      </td>

                      <td className="p-3 whitespace-nowrap text-on-surface font-mono">
                        {tx.date ? tx.date.slice(0, 10) : "-"}
                      </td>

                      <td className="p-3 max-w-xs">
                        <div className="font-bold text-on-surface truncate" title={tx.description || ""}>
                          {tx.description || "Ingen beskrivning"}
                        </div>
                        {tx.note && (
                          <div className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5 truncate" title={tx.note}>
                            <span className="material-symbols-outlined text-[12px] text-amber-500">
                              sticky_note_2
                            </span>
                            <span>{tx.note}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {tx.category || "Okategoriserad"}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="text-on-surface font-semibold">{tx.area || "-"}</div>
                        <div className="text-[10px] text-on-surface-variant">{tx.type || "-"}</div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="text-on-surface-variant font-medium">
                          {tx.account || "-"}
                        </span>
                      </td>

                      <td
                        className={`p-3 text-right font-black font-headline whitespace-nowrap text-sm ${
                          isExpense ? "text-slate-800" : "text-emerald-600"
                        }`}
                      >
                        {formatSEK(tx.amount)}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingTx(tx)}
                            title="Redigera & träna AI"
                            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>

                          <button
                            onClick={() => setInspectTx(tx)}
                            title="Granska SHA-256 fingeravtryck"
                            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-amber-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">fingerprint</span>
                          </button>

                          <button
                            onClick={() => handleDeleteSingle(tx)}
                            title="Radera transaktion"
                            className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span>Rader per sida:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="p-1 bg-surface-container-low border border-slate-200 rounded text-xs outline-none"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
            <span>
              Visar {totalCount === 0 ? 0 : (page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, totalCount)} av {totalCount.toLocaleString("sv-SE")}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page <= 1}
              className="p-1.5 rounded hover:bg-surface-container-high disabled:opacity-30 disabled:pointer-events-none"
              title="Första sidan"
            >
              <span className="material-symbols-outlined text-sm">first_page</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded hover:bg-surface-container-high disabled:opacity-30 disabled:pointer-events-none"
              title="Föregående sida"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            <span className="px-3 font-bold text-on-surface">
              Sida {page} av {totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded hover:bg-surface-container-high disabled:opacity-30 disabled:pointer-events-none"
              title="Nästa sida"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              className="p-1.5 rounded hover:bg-surface-container-high disabled:opacity-30 disabled:pointer-events-none"
              title="Sista sidan"
            >
              <span className="material-symbols-outlined text-sm">last_page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-outline-variant/30 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="text-xl font-bold font-headline text-on-surface">
                Redigera Transaktion
              </h3>
              <button
                onClick={() => setEditingTx(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  Beskrivning
                </label>
                <input
                  type="text"
                  value={editingTx.description || ""}
                  onChange={(e) =>
                    setEditingTx({ ...editingTx, description: e.target.value })
                  }
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Datum
                  </label>
                  <input
                    type="date"
                    value={editingTx.date ? editingTx.date.slice(0, 10) : ""}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, date: e.target.value })
                    }
                    className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Belopp (SEK)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingTx.amount}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, amount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Område
                  </label>
                  <select
                    value={editingTx.area || ""}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, area: e.target.value })
                    }
                    className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
                  >
                    {availableAreas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Typ
                  </label>
                  <input
                    type="text"
                    value={editingTx.type || ""}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, type: e.target.value })
                    }
                    className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={editingTx.category || ""}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, category: e.target.value })
                    }
                    className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  Anteckning / Notering
                </label>
                <input
                  type="text"
                  value={editingTx.note || ""}
                  onChange={(e) =>
                    setEditingTx({ ...editingTx, note: e.target.value })
                  }
                  placeholder="Valfri anteckning..."
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">
                  psychology
                </span>
                <span>
                  Ändringar i kategori och område sparas som återkopplingsdata för att förbättra
                  framtida AI-kategoriseringar.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-6 py-2 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary-hover shadow-sm disabled:opacity-50"
                >
                  {isSavingEdit ? "Sparar..." : "Spara ändringar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Fingerprint Modal */}
      {inspectTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-outline-variant/30 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">fingerprint</span>
                <h3 className="text-xl font-bold font-headline text-on-surface">
                  SHA-256 Fingeravtryck
                </h3>
              </div>
              <button
                onClick={() => {
                  setInspectTx(null);
                  setCopiedHash(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  SHA-256 Hash
                </label>
                <div className="p-3 bg-surface-container-low border border-slate-200 rounded-xl font-mono text-[11px] break-all select-all flex items-center justify-between gap-2">
                  <span>{inspectTx.hash || "Ingen hash genererad"}</span>
                  {inspectTx.hash && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inspectTx.hash || "");
                        setCopiedHash(true);
                        setTimeout(() => setCopiedHash(false), 2000);
                      }}
                      className="text-primary hover:text-primary-hover font-sans text-xs font-bold whitespace-nowrap ml-2"
                    >
                      {copiedHash ? "Kopierad!" : "Kopiera"}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    System-ID (UUID)
                  </label>
                  <p className="p-2 bg-surface-container-low rounded-lg font-mono text-[11px] truncate">
                    {inspectTx.id}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Importerad
                  </label>
                  <p className="p-2 bg-surface-container-low rounded-lg font-mono text-[11px]">
                    {inspectTx.createdAt ? new Date(inspectTx.createdAt).toLocaleString("sv-SE") : "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Konto
                  </label>
                  <p className="p-2 bg-surface-container-low rounded-lg font-medium">
                    {inspectTx.account || "-"}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Överföring
                  </label>
                  <p className="p-2 bg-surface-container-low rounded-lg font-medium">
                    {inspectTx.transferFrom || inspectTx.transferTo
                      ? `${inspectTx.transferFrom || ""} -> ${inspectTx.transferTo || ""}`
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  Hur dedupliceringen fungerar
                </p>
                Fingeravtrycket beräknas deterministiskt från transaktionens datum, belopp,
                beskrivning, konto och förekomstsekvens på samma dag. Detta tillåter legitima
                köp med samma belopp och butik utan att dubbletter skapas vid upprepade importer.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setInspectTx(null);
                  setCopiedHash(false);
                }}
                className="px-5 py-2 bg-slate-800 text-white font-bold rounded-lg text-xs hover:bg-slate-900"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Categorize Modal */}
      {batchCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-2xl border border-outline-variant/30 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="text-xl font-bold font-headline text-on-surface">
                Kategorisera {selectedIds.size} transaktioner
              </h3>
              <button
                onClick={() => setBatchCategoryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  Område
                </label>
                <select
                  value={batchArea}
                  onChange={(e) => {
                    setBatchArea(e.target.value);
                    setBatchType("");
                    setBatchCategory("");
                  }}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
                >
                  {availableAreas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  Typ
                </label>
                <select
                  value={batchType}
                  onChange={(e) => {
                    setBatchType(e.target.value);
                    setBatchCategory("");
                  }}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Välj typ...</option>
                  {batchArea &&
                    taxonomy[batchArea] &&
                    Object.keys(taxonomy[batchArea]).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder="Ange eller välj kategori..."
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary mb-2"
                />

                {batchArea && batchType && taxonomy[batchArea]?.[batchType] && (
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                    {taxonomy[batchArea][batchType].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setBatchCategory(c)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                          batchCategory === c
                            ? "bg-primary text-white border-primary"
                            : "bg-surface-container-low hover:bg-surface-container-high border-slate-200"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBatchCategoryModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-50"
                >
                  Avbryt
                </button>
                <button
                  type="button"
                  onClick={handleBatchCategorize}
                  disabled={isBatchSaving || !batchCategory}
                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 shadow-sm disabled:opacity-50"
                >
                  {isBatchSaving ? "Uppdaterar..." : "Tillämpa på alla"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
