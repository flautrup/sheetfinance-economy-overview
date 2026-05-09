"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";

export default function BucketTargetsPage() {
  const { t } = useTranslation();
  const [targets, setTargets] = useState<Record<string, string>>({
    BUFFER: "",
    PRESERVE: "",
    GROWTH: "",
    PLAY: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/buckets/targets")
      .then(res => res.json())
      .then(data => {
        if (data.targets) {
          setTargets(prev => ({
            ...prev,
            BUFFER: data.targets.BUFFER?.toString() || "",
            PRESERVE: data.targets.PRESERVE?.toString() || "",
            GROWTH: data.targets.GROWTH?.toString() || "",
            PLAY: data.targets.PLAY?.toString() || ""
          }));
        }
      });
  }, []);

  const handleChange = (bucket: string, val: string) => {
    setTargets(prev => ({ ...prev, [bucket]: val }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      await fetch("/api/buckets/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targets })
      });
      setMessage("Målen sparades framgångsrikt!");
    } catch (error: any) {
      setMessage("Ett fel uppstod.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">
          Bucket Targets
        </h2>
        <p className="text-on-surface-variant font-medium mt-1">
          Ställ in målvärden för dina hinkar för att följa din utveckling mot ekonomiska mål.
        </p>
      </header>

      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient space-y-6">
        {[
          { key: "BUFFER", label: t("bufferBucket") },
          { key: "PRESERVE", label: t("preserveBucket") },
          { key: "GROWTH", label: t("growthBucket") },
          { key: "PLAY", label: t("playBucket") }
        ].map(b => (
          <div key={b.key}>
            <label className="block text-sm font-bold text-on-surface mb-2">{b.label}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              <input
                type="number"
                min="0"
                max="100"
                value={targets[b.key]}
                onChange={e => handleChange(b.key, e.target.value)}
                placeholder="T.ex. 15"
                className="w-full pl-10 p-4 bg-surface-container-low border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
              />
            </div>
          </div>
        ))}

        <div className="pt-4 flex items-center gap-4 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-ambient hover:scale-95 transition-all"
          >
            {isSaving ? "Sparar..." : "Spara Mål"}
          </button>
          {message && <span className="text-sm font-bold text-emerald-600">{message}</span>}
        </div>
      </div>
    </div>
  );
}
