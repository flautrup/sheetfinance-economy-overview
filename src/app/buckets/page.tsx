"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

type BucketsData = {
  buckets: { BUFFER: number; PRESERVE: number; GROWTH: number; PLAY: number; };
  compareBuckets?: { BUFFER: number; PRESERVE: number; GROWTH: number; PLAY: number; } | null;
  targets: { BUFFER: number | null; PRESERVE: number | null; GROWTH: number | null; PLAY: number | null; };
  availableDates: string[];
};

export default function BucketsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<BucketsData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [compareDate, setCompareDate] = useState<string>("");

  useEffect(() => {
    let url = "/api/buckets";
    if (selectedDate) url += `?date=${selectedDate}`;
    if (compareDate) url += (selectedDate ? '&' : '?') + `compareDate=${compareDate}`;

    fetch(url)
      .then(res => res.json())
      .then(d => {
        if (!selectedDate && d.availableDates && d.availableDates.length > 0) {
          setSelectedDate(d.availableDates[0]);
          if (d.availableDates.length > 1) {
            setCompareDate(d.availableDates[1]);
          }
        }
        setData(d);
      });
  }, [selectedDate, compareDate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(val);
  };

  const renderDiff = (current: number, compare: number | undefined | null) => {
    if (compare == null) return null;
    const diff = current - compare;
    if (diff === 0) return null;
    const color = diff > 0 ? "text-emerald-500" : "text-red-500";
    const sign = diff > 0 ? "+" : "";
    return <span className={`text-xs font-bold ml-2 ${color}`}>{sign} {formatCurrency(diff)}</span>;
  };

  if (!data) return <div className="p-10">Laddar hinkarna...</div>;
  if ('error' in data) return <div className="p-10 text-red-500">Fel vid inläsning: {data.error as string}. Starta om dev-servern om du nyligen gjort databasändringar.</div>;

  const totalAssets = Object.values(data.buckets).reduce((acc, curr) => acc + curr, 0);
  const totalCompareAssets = data.compareBuckets ? Object.values(data.compareBuckets).reduce((acc, curr) => acc + curr, 0) : null;

  const calculateMonetaryTarget = (percentage: number | null) => {
    if (!percentage) return null;
    return (percentage / 100) * totalAssets;
  };

  const calculateProgress = (val: number, percentage: number | null) => {
    const targetVal = calculateMonetaryTarget(percentage);
    if (!targetVal || targetVal === 0) return 0;
    return Math.min(100, Math.round((val / targetVal) * 100));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-2">Four Bucket Model</h2>
          <p className="text-on-surface-variant max-w-xl font-medium leading-relaxed">
            Fördela strategiskt ditt kapital över fyra hinkar. Denna modell ser till att dina omedelbara behov möts samtidigt som du bygger för framtiden.
          </p>
          {data?.availableDates && data.availableDates.length > 0 && (
            <div className="flex gap-4 mt-6 items-center">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Välj Datum</label>
                <select 
                  className="bg-surface-container text-sm rounded-lg p-2 text-on-surface border-none focus:ring-2 focus:ring-primary"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {data.availableDates.map(d => (
                    <option key={d} value={d}>{new Date(d).toLocaleDateString("sv-SE")}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Jämför Med</label>
                <select 
                  className="bg-surface-container text-sm rounded-lg p-2 text-on-surface border-none focus:ring-2 focus:ring-primary"
                  value={compareDate}
                  onChange={(e) => setCompareDate(e.target.value)}
                >
                  <option value="">Ingen</option>
                  {data.availableDates.map(d => (
                    <option key={d} value={d}>{new Date(d).toLocaleDateString("sv-SE")}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Link href="/buckets/mapping" className="px-5 py-2.5 bg-surface-container-low text-on-surface-variant rounded-lg font-semibold text-sm hover:bg-surface-container-high transition-colors">
            Kategorier
          </Link>
          <Link href="/buckets/targets" className="px-5 py-2.5 gradient-primary text-white rounded-lg font-semibold text-sm shadow-ambient flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">tune</span>
            Sätt Mål
          </Link>
        </div>
      </section>

      {/* Overview Card */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center justify-between gap-6 w-full max-w-sm">
        <div className="text-left w-full">
          <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-1">Kartlagt Kapital (Summa av alla hinkar)</span>
          <div className="flex items-baseline">
            <span className="text-3xl font-extrabold font-headline">{formatCurrency(totalAssets)}</span>
            {renderDiff(totalAssets, totalCompareAssets)}
          </div>
        </div>
      </div>

      {/* Bento Grid: The Four Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Bucket 1: Buffer */}
        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border-t-4 border-emerald-400 shadow-ambient">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-3xl">shield</span>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded uppercase">Säker</span>
          </div>
          <h3 className="text-xl font-bold font-headline mb-2">{t("bufferBucket")}</h3>
          <p className="text-sm text-on-surface-variant mb-6 leading-snug">Buffert för nödsituationer och kommande 12 månaders utgifter.</p>
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-baseline flex-wrap">
                <span className="text-2xl font-bold">{formatCurrency(data.buckets.BUFFER)}</span>
                {renderDiff(data.buckets.BUFFER, data.compareBuckets?.BUFFER)}
              </div>
              <span className="text-xs font-semibold text-on-surface-variant text-right">
                Mål: {data.targets.BUFFER ? `${data.targets.BUFFER}% (${formatCurrency(calculateMonetaryTarget(data.targets.BUFFER) || 0)})` : "-"}
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500" 
                style={{ width: `${calculateProgress(data.buckets.BUFFER, data.targets.BUFFER)}%` }}
              ></div>
            </div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Andel: {totalAssets ? Math.round((data.buckets.BUFFER/totalAssets)*100) : 0}%
            </p>
          </div>
        </div>

        {/* Bucket 2: Preserve */}
        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border-t-4 border-emerald-600 shadow-ambient">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-3xl">account_balance</span>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded uppercase">Trygg</span>
          </div>
          <h3 className="text-xl font-bold font-headline mb-2">{t("preserveBucket")}</h3>
          <p className="text-sm text-on-surface-variant mb-6 leading-snug">Mellanrisk. Stabila, diversifierade tillgångar över tid.</p>
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-baseline flex-wrap">
                <span className="text-2xl font-bold">{formatCurrency(data.buckets.PRESERVE)}</span>
                {renderDiff(data.buckets.PRESERVE, data.compareBuckets?.PRESERVE)}
              </div>
              <span className="text-xs font-semibold text-on-surface-variant text-right">
                Mål: {data.targets.PRESERVE ? `${data.targets.PRESERVE}% (${formatCurrency(calculateMonetaryTarget(data.targets.PRESERVE) || 0)})` : "-"}
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
               <div 
                className="h-full bg-emerald-700" 
                style={{ width: `${calculateProgress(data.buckets.PRESERVE, data.targets.PRESERVE)}%` }}
              ></div>
            </div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
               Andel: {totalAssets ? Math.round((data.buckets.PRESERVE/totalAssets)*100) : 0}%
            </p>
          </div>
        </div>

        {/* Bucket 3: Growth */}
        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border-t-4 border-emerald-800 shadow-ambient">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-900">
              <span className="material-symbols-outlined text-3xl">rocket_launch</span>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-900 text-emerald-50 rounded uppercase">Tillväxt</span>
          </div>
          <h3 className="text-xl font-bold font-headline mb-2">{t("growthBucket")}</h3>
          <p className="text-sm text-on-surface-variant mb-6 leading-snug">Långsiktigt, högre risk. Indexfonder och tillväxtmarknader.</p>
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-baseline flex-wrap">
                <span className="text-2xl font-bold">{formatCurrency(data.buckets.GROWTH)}</span>
                {renderDiff(data.buckets.GROWTH, data.compareBuckets?.GROWTH)}
              </div>
               <span className="text-xs font-semibold text-on-surface-variant text-right">
                Mål: {data.targets.GROWTH ? `${data.targets.GROWTH}% (${formatCurrency(calculateMonetaryTarget(data.targets.GROWTH) || 0)})` : "-"}
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
               <div 
                className="h-full bg-emerald-900" 
                style={{ width: `${calculateProgress(data.buckets.GROWTH, data.targets.GROWTH)}%` }}
              ></div>
            </div>
            <p className="text-[10px] uppercase font-bold text-tertiary tracking-wider">
               Andel: {totalAssets ? Math.round((data.buckets.GROWTH/totalAssets)*100) : 0}%
            </p>
          </div>
        </div>

        {/* Bucket 4: Play */}
        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border-t-4 border-slate-300 shadow-ambient">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-3xl">celebration</span>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">Lek</span>
          </div>
          <h3 className="text-xl font-bold font-headline mb-2">{t("playBucket")}</h3>
          <p className="text-sm text-on-surface-variant mb-6 leading-snug">För spekulation, krypto, eller livsstilsutsvävningar.</p>
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-baseline flex-wrap">
                <span className="text-2xl font-bold">{formatCurrency(data.buckets.PLAY)}</span>
                {renderDiff(data.buckets.PLAY, data.compareBuckets?.PLAY)}
              </div>
               <span className="text-xs font-semibold text-on-surface-variant text-right">
                Mål: {data.targets.PLAY ? `${data.targets.PLAY}% (${formatCurrency(calculateMonetaryTarget(data.targets.PLAY) || 0)})` : "-"}
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-400" 
                style={{ width: `${calculateProgress(data.buckets.PLAY, data.targets.PLAY)}%` }}
              ></div>
            </div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
               Andel: {totalAssets ? Math.round((data.buckets.PLAY/totalAssets)*100) : 0}%
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
