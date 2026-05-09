"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";

type WealthLadderData = {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  liquidCapital: number;
  monthlyPassiveIncome: number;
  avgMonthlyExpenses: number;
  error?: string;
};

export default function WealthLadderPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<WealthLadderData | null>(null);

  useEffect(() => {
    fetch("/api/wealth-ladder")
      .then(res => res.json())
      .then(d => setData(d));
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(val);
  };

  if (!data) return <div className="p-10">Laddar rikedomstrappan...</div>;
  if (data.error) return <div className="p-10 text-red-500">Fel: {data.error}. Kontrollera din databas och starta om dev-servern.</div>;

  const { netWorth, liquidCapital, monthlyPassiveIncome, avgMonthlyExpenses } = data;

  const steps = [
    {
      level: 1,
      title: "Nivå 1: Lön-till-lön",
      desc: "Man lever från lön till lön utan större marginaler. Lösningen är att öka inkomster, inte spara på marginalen.",
      target: 100000,
      current: netWorth,
      metric: "Nettoförmögenhet"
    },
    {
      level: 2,
      title: "Nivå 2: Vardagstrygghet",
      desc: "Du har en buffert och kan hantera oväntade utgifter. Jobba smartare och öka din inkomst.",
      target: 1000000,
      current: netWorth,
      metric: "Nettoförmögenhet"
    },
    {
      level: 3,
      title: "Nivå 3: Villa-volvo-vovve-nivån",
      desc: "Ekonomisk trygghet. Investeringarna börjar bli viktigare än lönen.",
      target: 10000000,
      current: netWorth,
      metric: "Nettoförmögenhet"
    },
    {
      level: 4,
      title: "Nivå 4: Resefrihet",
      desc: "Kan köpa nästan vad som helst. Investeringarnas svängningar påverkar mer än månadslönen.",
      target: 100000000,
      current: netWorth,
      metric: "Nettoförmögenhet"
    },
    {
      level: 5,
      title: "Nivå 5: Bostadsfrihet",
      desc: "Flera bostäder. Pengar börjar skapa problem snarare än lösa dem.",
      target: 1000000000,
      current: netWorth,
      metric: "Nettoförmögenhet"
    },
    {
      level: 6,
      title: "Nivå 6: Påverkansfrihet",
      desc: "Möjlighet att påverka många människors liv. Fokus på arv och mening.",
      target: Infinity,
      current: netWorth,
      metric: "Nettoförmögenhet"
    }
  ];

  const currentStep = steps.find(s => s.current < s.target) || steps[steps.length - 1];
  const currentLevel = currentStep.level;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">Rikedomstrappan</h2>
        <p className="text-on-surface-variant font-medium mt-1">Mät din resa mot ekonomiskt oberoende.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient border border-white/40">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Förmögenhet</span>
          <span className="block text-2xl font-extrabold">{formatCurrency(netWorth)}</span>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient border border-white/40">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Snittutgift (månad)</span>
          <span className="block text-2xl font-extrabold">{formatCurrency(avgMonthlyExpenses)}</span>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient border border-white/40">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Passiv Månadsinkomst</span>
          <span className="block text-2xl font-extrabold text-primary">{formatCurrency(monthlyPassiveIncome)}</span>
        </div>
        <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-ambient border border-white/40 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-100 mb-1">Din Aktuella Nivå</span>
          <span className="block text-3xl font-extrabold font-headline">Nivå {currentLevel}</span>
        </div>
      </div>

      <div className="relative space-y-6 pb-10">
        <div className="absolute top-0 bottom-10 left-6 md:left-8 w-1 bg-surface-container rounded-full z-0"></div>

        {steps.map((step, idx) => {
          const isPassed = step.level < 6 ? step.current >= step.target : false;
          const isNext = !isPassed && (idx === 0 || steps[idx - 1].current >= steps[idx - 1].target);
          const progress = step.target === Infinity && isNext ? 100 : Math.min(100, Math.max(0, (step.current / step.target) * 100));

          let bgClass = "bg-surface-container-lowest border-slate-200";
          let circleClass = "bg-surface-container-high border-4 border-surface-container text-slate-400";
          
          if (isPassed) {
            bgClass = "bg-surface-container-lowest border-emerald-400";
            circleClass = "bg-emerald-500 border-4 border-emerald-100 text-white";
          } else if (isNext) {
            bgClass = "bg-emerald-50 border-emerald-500 shadow-ambient";
            circleClass = "bg-emerald-600 border-4 border-emerald-200 text-white";
          }

          return (
            <div key={idx} className={`relative z-10 flex gap-6 ml-4 md:ml-6 items-stretch`}>
              <div className="flex flex-col items-center justify-start mt-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${circleClass}`}>
                  {isPassed ? <span className="material-symbols-outlined text-sm">check</span> : step.level}
                </div>
              </div>
              <div className={`flex-1 p-6 md:p-8 rounded-2xl border-2 transition-all ${bgClass} ${isNext ? 'scale-[1.01]' : ''}`}>
                 <div className="mb-4">
                    <h3 className="text-xl font-bold font-headline mb-1 text-on-surface">{step.title}</h3>
                    <p className="text-sm font-medium text-on-surface-variant max-w-lg">{step.desc}</p>
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-slate-100/60">
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest text-slate-500">
                      <span>Målvärde ({step.metric}): {step.target === Infinity ? "∞ kr" : formatCurrency(step.target)}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isPassed ? 'bg-emerald-500' : 'bg-primary'}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end mt-2">
                        <span className="text-xs font-bold text-on-surface-variant">Du har: {formatCurrency(step.current)}</span>
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
