"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

type DashboardData = {
  liquidCapital: number;
  savingsRate: number;
  chartData: { month: string; liquidCapital: number }[];
  historicalMetrics?: {
    date: string;
    totalAssets: number;
    debt: number;
    ownCapital: number;
    solvency: number;
    liquidityMonths: number;
  }[];
};

export default function Home() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(d => {
        setData(d);
      });
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">
            {t("dashboard")}
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">Din aggregerade ekonomiska status</p>
        </div>
        <div className="flex gap-2">
          <Link href="/upload" className="px-5 py-2.5 gradient-primary text-white rounded-lg font-semibold text-sm shadow-ambient flex items-center gap-2 hover:scale-95 transition-transform">
            <span className="material-symbols-outlined text-sm">cloud_upload</span>
            {t("upload")}
          </Link>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-white/40">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 opacity-70">
            Likvidt Kapital
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">
              {data ? formatCurrency(data.liquidCapital) : "Laddar..."}
            </h3>
            <span className="text-primary font-bold text-sm flex items-center">
              <span className="material-symbols-outlined text-xs">check_circle</span> Safe
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-white/40">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 opacity-70">
            {t("savingsRate")}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">
              {data ? `${data.savingsRate}%` : "Laddar..."}
            </h3>
            <span className="text-secondary font-bold text-sm">Snitt</span>
          </div>
          <div className="mt-6 flex gap-1">
            <div className="h-1.5 w-1/4 bg-primary rounded-full"></div>
            <div className="h-1.5 w-1/4 bg-primary rounded-full"></div>
            <div className="h-1.5 w-1/4 bg-primary/40 rounded-full"></div>
            <div className="h-1.5 w-1/4 bg-surface-container-high rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Link href="/buckets" className="group bg-surface-container-low p-6 rounded-xl shadow-sm border border-slate-100 hover:border-emerald-300 transition-all flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold font-headline text-on-surface group-hover:text-emerald-700 transition-colors">Four Bucket Model</h4>
              <p className="text-sm text-on-surface-variant font-medium">Hantera risk och strukturera ditt kapital.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
         </Link>
         <Link href="/wealth-ladder" className="group bg-surface-container-low p-6 rounded-xl shadow-sm border border-slate-100 hover:border-emerald-300 transition-all flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold font-headline text-on-surface group-hover:text-emerald-700 transition-colors">Rikedomstrappan</h4>
              <p className="text-sm text-on-surface-variant font-medium">Mät din faktiska frihet och se din nuvarande nivå.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
         </Link>
      </div>
      
      {/* Chart Section */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient relative overflow-hidden">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h4 className="text-xl font-bold font-headline text-on-surface">{t("growthTrajectory")} (Likvidt Kapital)</h4>
            <p className="text-on-surface-variant text-sm">Historisk utveckling</p>
          </div>
        </div>
        <div className="h-64 border-t border-slate-100 pt-8 mt-4">
          {data && data.chartData && data.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData}>
                <XAxis dataKey="month" stroke="#e0e3e5" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#e0e3e5" fontSize={10} tickLine={false} axisLine={false} width={80} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value as number)}
                  labelStyle={{ color: '#191c1e', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="liquidCapital" stroke="#006c4a" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400 font-medium">{data ? "Ingen historisk data funnen" : "Laddar grafdata..."}</p>
            </div>
          )}
        </div>
      </div>

      {/* Historical Metrics Table */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-xl font-bold font-headline text-on-surface">Historisk Översikt</h4>
            <p className="text-on-surface-variant text-sm">Nyckeltal över tid</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant text-xs uppercase tracking-widest text-on-surface-variant">
                <th className="p-4 font-bold">Datum</th>
                <th className="p-4 font-bold">
                  Skulder
                  <span className="material-symbols-outlined text-[10px] ml-1 align-super cursor-help" title="Summan av alla lån och krediter.">info</span>
                </th>
                <th className="p-4 font-bold">
                  Eget Kapital
                  <span className="material-symbols-outlined text-[10px] ml-1 align-super cursor-help" title="Totala tillgångar minus totala skulder (Nettoförmögenhet).">info</span>
                </th>
                <th className="p-4 font-bold whitespace-nowrap">
                  Likviditet (mån)
                  <span className="material-symbols-outlined text-[10px] ml-1 align-super cursor-help" title="Eget kapital dividerat med din genomsnittliga månadsutgift under de senaste 6 månaderna (visar hur många månader kapitalet räcker).">info</span>
                </th>
                <th className="p-4 font-bold">
                  Soliditet
                  <span className="material-symbols-outlined text-[10px] ml-1 align-super cursor-help" title="Hur stor andel av dina tillgångar som är finansierade med eget kapital (Eget kapital / Totala tillgångar).">info</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.historicalMetrics && data.historicalMetrics.length > 0 ? (
                data.historicalMetrics.map((hm, idx) => (
                  <tr key={idx} className="border-b border-surface-container hover:bg-surface-container-low transition-colors text-sm font-medium">
                    <td className="p-4 whitespace-nowrap">{new Date(hm.date).toLocaleDateString("sv-SE")}</td>
                    <td className="p-4 text-red-500">{formatCurrency(hm.debt)}</td>
                    <td className="p-4 font-bold">{formatCurrency(hm.ownCapital)}</td>
                    <td className="p-4">
                      {hm.liquidityMonths.toFixed(1)} mån
                      {hm.estimatedLiquidity && (
                        <span className="text-amber-500 ml-1 cursor-help" title="Beräknad med nutida snittutgift (saknar historisk utgiftsdata)">*</span>
                      )}
                    </td>
                    <td className="p-4">{hm.solvency.toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-on-surface-variant font-medium">Ingen historisk data funnen</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
