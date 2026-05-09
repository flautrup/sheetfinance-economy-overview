"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";

type Mapping = {
  balanceCategory: string;
  bucket: string;
};

export default function MappingPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/buckets/mapping")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        const maps: Record<string, string> = {};
        data.mappings?.forEach((m: any) => {
          maps[m.balanceDescription] = m.bucket;
        });
        setMappings(maps);
      });
  }, []);

  const handleChange = (cat: string, val: string) => {
    setMappings((prev) => ({ ...prev, [cat]: val }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = Object.keys(mappings).map((cat) => ({
      balanceDescription: cat,
      bucket: mappings[cat],
    }));

    await fetch("/api/buckets/mapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mappings: payload }),
    });
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">
          Bucket Mapping
        </h2>
        <p className="text-on-surface-variant font-medium mt-1">
          Koppla dina Balansräkningskategorier till de fyra hinkarna.
        </p>
      </header>

      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient">
        {categories.length === 0 ? (
          <p className="text-slate-500">Inga kategorier hittades. Vänligen importera din data först.</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-100 uppercase tracking-widest text-xs font-bold text-slate-400">
              <div>Beskrivning / Konto (från Google Sheets)</div>
              <div>RikaTillsammans Hink</div>
            </div>
            
            {categories.map((cat) => (
              <div key={cat} className="grid grid-cols-2 gap-4 items-center">
                <div className="text-sm font-bold text-slate-800">{cat}</div>
                <select
                  value={mappings[cat] || ""}
                  onChange={(e) => handleChange(cat, e.target.value)}
                  className="bg-surface-container-low border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full max-w-xs"
                >
                  <option value="" disabled>-- Välj en hink --</option>
                  <option value="BUFFER">{t("bufferBucket")}</option>
                  <option value="PRESERVE">{t("preserveBucket")}</option>
                  <option value="GROWTH">{t("growthBucket")}</option>
                  <option value="PLAY">{t("playBucket")}</option>
                  <option value="IGNORE">Ignorera (t.ex. skulder om de räknas separat)</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-ambient hover:scale-95 transition-all"
        >
          {isSaving ? t("saving") : t("saveData")}
        </button>
      </div>
    </div>
  );
}
