"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";


type RuleItem = {
  id: string;
  keyword: string;
  area: string;
  type: string;
  category: string;
};

type TaxonomyNodeRaw = {
  id: string;
  area: string;
  type: string;
  category: string;
};

export default function MappingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"mapping" | "rules" | "taxonomy">("mapping");

  // Tab 1: Bucket Mapping States
  const [categories, setCategories] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isSavingMapping, setIsSavingMapping] = useState(false);

  // Tab 2: Rules States
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [newRuleKeyword, setNewRuleKeyword] = useState("");
  const [newRuleArea, setNewRuleArea] = useState("Utgift");
  const [newRuleType, setNewRuleType] = useState("");
  const [newRuleCategory, setNewRuleCategory] = useState("");
  const [isSavingRule, setIsSavingRule] = useState(false);

  // Tab 3: Taxonomy States
  const [taxonomyTree, setTaxonomyTree] = useState<Record<string, Record<string, string[]>>>({});
  const [taxonomyNodes, setTaxonomyNodes] = useState<TaxonomyNodeRaw[]>([]);
  const [newTaxArea, setNewTaxArea] = useState("Utgift");
  const [newTaxType, setNewTaxType] = useState("");
  const [newTaxCategory, setNewTaxCategory] = useState("");
  const [isSavingTax, setIsSavingTax] = useState(false);

  const [uiMessage, setUiMessage] = useState("");

  // Load Bucket Mappings
  const loadMappings = () => {
    fetch("/api/buckets/mapping")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        const maps: Record<string, string> = {};
        data.mappings?.forEach((m: { balanceDescription: string; bucket: string }) => {
          maps[m.balanceDescription] = m.bucket;
        });
        setMappings(maps);
      });
  };

  // Load Pre-classification Rules
  const loadRules = () => {
    fetch("/api/buckets/rules")
      .then((r) => r.json())
      .then((data) => {
        if (data.rules) setRules(data.rules);
      });
  };

  // Load Category Taxonomy nodes
  const loadTaxonomy = () => {
    fetch("/api/buckets/taxonomy")
      .then((r) => r.json())
      .then((data) => {
        if (data.taxonomy) setTaxonomyTree(data.taxonomy);
        if (data.rawNodes) setTaxonomyNodes(data.rawNodes);
      });
  };

  useEffect(() => {
    loadMappings();
    loadRules();
    loadTaxonomy();
  }, []);

  // Update cascading values when rule area changes
  useEffect(() => {
    const availableTypes = Object.keys(taxonomyTree[newRuleArea] || {});
    if (availableTypes.length > 0) {
      setNewRuleType(availableTypes[0]);
      const availableCategories = taxonomyTree[newRuleArea][availableTypes[0]] || [];
      setNewRuleCategory(availableCategories[0] || "");
    } else {
      setNewRuleType("");
      setNewRuleCategory("");
    }
  }, [newRuleArea, taxonomyTree]);

  // Update cascading values when rule type changes
  useEffect(() => {
    if (newRuleType) {
      const availableCategories = taxonomyTree[newRuleArea]?.[newRuleType] || [];
      setNewRuleCategory(availableCategories[0] || "");
    } else {
      setNewRuleCategory("");
    }
  }, [newRuleType, newRuleArea, taxonomyTree]);

  // Handle Bucket selection
  const handleMappingChange = (cat: string, val: string) => {
    setMappings((prev) => ({ ...prev, [cat]: val }));
  };

  // Save Bucket Mappings
  const handleSaveMappings = async () => {
    setIsSavingMapping(true);
    setUiMessage("");
    try {
      const payload = Object.keys(mappings).map((cat) => ({
        balanceDescription: cat,
        bucket: mappings[cat],
      }));

      const res = await fetch("/api/buckets/mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mappings: payload }),
      });
      if (res.ok) {
        setUiMessage("Kontokopplingarna sparades framgångsrikt!");
      } else {
        setUiMessage("Misslyckades att spara kontokopplingar.");
      }
    } catch {
      setUiMessage("Ett fel uppstod vid nätverksöverföringen.");
    } finally {
      setIsSavingMapping(false);
    }
  };

  // Create Pre-classification Rule
  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleKeyword || !newRuleArea || !newRuleType || !newRuleCategory) return;
    setIsSavingRule(true);
    setUiMessage("");

    try {
      const res = await fetch("/api/buckets/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: newRuleKeyword,
          area: newRuleArea,
          type: newRuleType,
          category: newRuleCategory,
        }),
      });
      if (res.ok) {
        setNewRuleKeyword("");
        loadRules();
        setUiMessage("Regeln lades till framgångsrikt!");
      } else {
        setUiMessage("Kunde inte lägga till regeln.");
      }
    } catch {
      setUiMessage("Ett nätverksfel uppstod.");
    } finally {
      setIsSavingRule(false);
    }
  };

  // Delete Pre-classification Rule
  const handleDeleteRule = async (id: string) => {
    setUiMessage("");
    try {
      const res = await fetch(`/api/buckets/rules?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadRules();
        setUiMessage("Regeln togs bort.");
      } else {
        setUiMessage("Kunde inte ta bort regeln.");
      }
    } catch {
      setUiMessage("Nätverksfel uppstod vid radering.");
    }
  };

  // Create Taxonomy Node
  const handleAddTaxNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxArea || !newTaxType || !newTaxCategory) return;
    setIsSavingTax(true);
    setUiMessage("");

    try {
      const res = await fetch("/api/buckets/taxonomy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: newTaxArea,
          type: newTaxType,
          category: newTaxCategory,
        }),
      });
      if (res.ok) {
        setNewTaxCategory("");
        loadTaxonomy();
        setUiMessage("Kategorin lades till i schemat!");
      } else {
        setUiMessage("Kunde inte lägga till kategorin. Kontrollera att den är unik.");
      }
    } catch {
      setUiMessage("Ett nätverksfel uppstod.");
    } finally {
      setIsSavingTax(false);
    }
  };

  // Delete Taxonomy Node
  const handleDeleteTaxNode = async (id: string) => {
    setUiMessage("");
    try {
      const res = await fetch(`/api/buckets/taxonomy?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadTaxonomy();
        setUiMessage("Kategorin togs bort från schemat.");
      } else {
        setUiMessage("Kunde inte radera kategorin.");
      }
    } catch {
      setUiMessage("Nätverksfel uppstod vid radering.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">
          Mapping & Schemas
        </h2>
        <p className="text-on-surface-variant font-medium mt-1">
          Hantera kontokopplingar, automatiska klassificeringsregler samt ditt kategorischema.
        </p>
      </header>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => { setActiveTab("mapping"); setUiMessage(""); }}
          className={`pb-3 font-bold text-sm uppercase tracking-wider transition-colors outline-none ${
            activeTab === "mapping"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Konto till Hink
        </button>
        <button
          onClick={() => { setActiveTab("rules"); setUiMessage(""); }}
          className={`pb-3 font-bold text-sm uppercase tracking-wider transition-colors outline-none ${
            activeTab === "rules"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Klassificeringsregler
        </button>
        <button
          onClick={() => { setActiveTab("taxonomy"); setUiMessage(""); }}
          className={`pb-3 font-bold text-sm uppercase tracking-wider transition-colors outline-none ${
            activeTab === "taxonomy"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Kategorischema (Taxonomi)
        </button>
      </div>

      {uiMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-semibold shadow-sm transition-all animate-pulse">
          {uiMessage}
        </div>
      )}

      {/* Tab Content 1: Bucket Mapping */}
      {activeTab === "mapping" && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient">
            {categories.length === 0 ? (
              <p className="text-slate-500 font-medium">Inga konton hittades. Vänligen importera din data från Google Sheets först.</p>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-100 dark:border-slate-800 uppercase tracking-widest text-xs font-bold text-slate-400">
                  <div>Beskrivning / Konto (från Google Sheets)</div>
                  <div>RikaTillsammans Hink</div>
                </div>

                {categories.map((cat) => (
                  <div key={cat} className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{cat}</div>
                    <select
                      value={mappings[cat] || ""}
                      onChange={(e) => handleMappingChange(cat, e.target.value)}
                      className="bg-surface-container-low border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full max-w-xs cursor-pointer"
                    >
                      <option value="" disabled>-- Välj en hink --</option>
                      <option value="BUFFER">{t("bufferBucket")}</option>
                      <option value="PRESERVE">{t("preserveBucket")}</option>
                      <option value="GROWTH">{t("growthBucket")}</option>
                      <option value="PLAY">{t("playBucket")}</option>
                      <option value="IGNORE">Ignorera konto</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSaveMappings}
            disabled={isSavingMapping}
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-ambient hover:scale-95 transition-all disabled:opacity-50"
          >
            {isSavingMapping ? t("saving") : t("saveData")}
          </button>
        </div>
      )}

      {/* Tab Content 2: Rules Management */}
      {activeTab === "rules" && (
        <div className="space-y-8">
          {/* Add Rule Form */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold font-headline text-on-surface mb-4">Skapa Ny Sökordsregel</h3>
            <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Beskrivning / Sökord (t.ex. netflix)</label>
                <input
                  type="text"
                  required
                  placeholder="T.ex. netflix"
                  value={newRuleKeyword}
                  onChange={(e) => setNewRuleKeyword(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Område</label>
                <select
                  value={newRuleArea}
                  onChange={(e) => setNewRuleArea(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-sm cursor-pointer"
                >
                  <option value="Utgift">Utgift</option>
                  <option value="Inkomst">Inkomst</option>
                  <option value="Överföring">Överföring</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Typ</label>
                <select
                  value={newRuleType}
                  onChange={(e) => setNewRuleType(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-sm cursor-pointer"
                >
                  {Object.keys(taxonomyTree[newRuleArea] || {}).map((typeKey) => (
                    <option key={typeKey} value={typeKey}>{typeKey}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kategori (Undergrupp)</label>
                <select
                  value={newRuleCategory}
                  onChange={(e) => setNewRuleCategory(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-sm cursor-pointer"
                >
                  {(taxonomyTree[newRuleArea]?.[newRuleType] || []).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </form>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddRule}
                disabled={isSavingRule || !newRuleKeyword}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm hover:scale-95 transition-transform disabled:opacity-50"
              >
                {isSavingRule ? "Sparar..." : "Spara Regel"}
              </button>
            </div>
          </div>

          {/* Rules Listing */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient">
            <h3 className="text-lg font-bold font-headline text-on-surface mb-4">Aktiva Regler ({rules.length})</h3>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-xs tracking-wider">
                    <th className="p-3">Sökord</th>
                    <th className="p-3">Område</th>
                    <th className="p-3">Typ</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-right">Åtgärd</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => (
                    <tr key={rule.id} className="border-b border-slate-50 dark:border-slate-900/50 hover:bg-slate-50/50 transition-colors font-medium">
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{rule.keyword}</td>
                      <td className="p-3">{rule.area}</td>
                      <td className="p-3 text-slate-500">{rule.type}</td>
                      <td className="p-3 text-slate-500">{rule.category}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="px-3 py-1 text-xs bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 font-bold rounded hover:scale-95 transition-transform"
                        >
                          Radera
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Category Taxonomy Manager */}
      {activeTab === "taxonomy" && (
        <div className="space-y-8">
          {/* Add Category Node Form */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold font-headline text-on-surface mb-4">Skapa Ny Kategori</h3>
            <form onSubmit={handleAddTaxNode} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Område (Huvudområde)</label>
                <select
                  value={newTaxArea}
                  onChange={(e) => setNewTaxArea(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-sm cursor-pointer"
                >
                  <option value="Utgift">Utgift</option>
                  <option value="Inkomst">Inkomst</option>
                  <option value="Överföring">Överföring</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Typ (Huvudgrupp)</label>
                <input
                  type="text"
                  required
                  placeholder="T.ex. Nöjen/Shopping"
                  value={newTaxType}
                  onChange={(e) => setNewTaxType(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kategori (Undergrupp)</label>
                <input
                  type="text"
                  required
                  placeholder="T.ex. Kläder/Skor"
                  value={newTaxCategory}
                  onChange={(e) => setNewTaxCategory(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-sm shadow-sm"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSavingTax || !newTaxType || !newTaxCategory}
                  className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm hover:scale-95 transition-transform disabled:opacity-50"
                >
                  {isSavingTax ? "Lägger till..." : "Spara Kategori"}
                </button>
              </div>
            </form>
          </div>

          {/* Taxonomy Listing */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient">
            <h3 className="text-lg font-bold font-headline text-on-surface mb-4">Aktiva Kategorier ({taxonomyNodes.length})</h3>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-xs tracking-wider">
                    <th className="p-3">Huvudområde (Area)</th>
                    <th className="p-3">Huvudgrupp (Type)</th>
                    <th className="p-3">Undergrupp (Category)</th>
                    <th className="p-3 text-right">Åtgärd</th>
                  </tr>
                </thead>
                <tbody>
                  {taxonomyNodes.map((node) => (
                    <tr key={node.id} className="border-b border-slate-50 dark:border-slate-900/50 hover:bg-slate-50/50 transition-colors font-medium">
                      <td className="p-3 font-bold text-slate-850 dark:text-slate-250">{node.area}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-200">{node.type}</td>
                      <td className="p-3 text-slate-500">{node.category}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteTaxNode(node.id)}
                          className="px-3 py-1 text-xs bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 font-bold rounded hover:scale-95 transition-transform"
                        >
                          Radera
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
