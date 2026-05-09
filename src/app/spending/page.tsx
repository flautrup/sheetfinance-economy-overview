"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type SpendingData = {
  chartData: { name: string; income: number; expense: number; surplus: number }[];
  categories: { name: string; amount: number }[];
  totalIncome: number;
  totalExpenses: number;
  averageSpending: number;
  averageIncome: number;
  totalSurplus: number;
  period: { start: string; end: string };
  error?: string;
};

export default function SpendingPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<SpendingData | null>(null);

  useEffect(() => {
    fetch("/api/spending")
      .then(res => res.json())
      .then(d => setData(d));
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(val);
  };

  if (!data) return <div className="p-10">Laddar utgifter...</div>;
  if (data.error) return <div className="p-10 text-red-500">Fel: {data.error}</div>;

  const savingsRate = data.totalIncome > 0 ? Math.round((data.totalSurplus / data.totalIncome) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header>
        <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">Kassaflöde & Utgifter</h2>
        <p className="text-on-surface-variant font-medium mt-1">Fullständig översikt av inkomster och utgifter (rullande 12 månader).</p>
      </header>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient border border-white/40">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Inkomst</span>
          <span className="block text-2xl font-extrabold text-primary">{formatCurrency(data.totalIncome)}</span>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Snitt: {formatCurrency(data.averageIncome)}</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient border border-white/40">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Utgift</span>
          <span className="block text-2xl font-extrabold text-on-surface">{formatCurrency(data.totalExpenses)}</span>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Snitt: {formatCurrency(data.averageSpending)}</p>
        </div>
        <div className={`p-6 rounded-xl shadow-ambient border transition-colors ${data.totalSurplus >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
          <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${data.totalSurplus >= 0 ? "text-emerald-800" : "text-red-800"}`}>Överblivet (Surplus)</span>
          <span className={`block text-2xl font-extrabold ${data.totalSurplus >= 0 ? "text-emerald-900" : "text-red-900"}`}>{formatCurrency(data.totalSurplus)}</span>
          <p className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${data.totalSurplus >= 0 ? "text-emerald-700/60" : "text-red-700/60"}`}>Månadssnitt: {formatCurrency(data.totalSurplus / (data.chartData.length || 1))}</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient border border-white/40 flex flex-col justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Sparkvot</span>
          <span className="block text-3xl font-black text-on-surface">{savingsRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-2xl shadow-ambient border border-white/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-headline">Inkomst vs. Utgift</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs font-bold text-slate-400">Inkomst</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                <span className="text-xs font-bold text-slate-400">Utgift</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData} barGap={4}>
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                   formatter={(val: any) => formatCurrency(val as number)}
                   cursor={{ fill: 'rgba(0,108,74,0.05)' }} 
                />
                <Bar dataKey="income" fill="#006c4a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient border border-white/40">
          <h3 className="text-lg font-bold font-headline mb-6">Kategorier</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {data.categories.map((cat, idx) => {
              const pct = Math.round((cat.amount / data.totalExpenses) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-on-surface">{cat.name}</span>
                    <span className="font-medium text-on-surface-variant">{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/60" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{pct}% av totalt</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
