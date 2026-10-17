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
  const { lang } = useTranslation();
  const isSv = lang === "sv";
  const [data, setData] = useState<WealthLadderData | null>(null);

  useEffect(() => {
    fetch("/api/wealth-ladder")
      .then(res => res.json())
      .then(d => setData(d));
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(isSv ? "sv-SE" : "en-US", {
      style: "currency",
      currency: isSv ? "SEK" : "USD",
      currencyDisplay: isSv ? "code" : "narrowSymbol",
      maximumFractionDigits: 0
    }).format(isSv ? val : val / 10);
  };

  if (!data) return <div className="p-10">{isSv ? "Laddar rikedomstrappan..." : "Loading wealth ladder..."}</div>;
  if (data.error) return <div className="p-10 text-red-500">Error: {data.error}</div>;

  const { netWorth, monthlyPassiveIncome, avgMonthlyExpenses } = data;

  const steps = isSv
    ? [
        {
          level: 1,
          title: "Nivå 1: Under 100 000 SEK – Lever från lön till lön",
          desc: "Du lever från lön till lön utan marginaler. Oförutsedda utgifter skapar stress och lösningen är att öka inkomsterna snarare än att spara på örena.",
          strategy: "Nivå 1 ➔ 2: Bygg säljbara färdigheter",
          target: 100000,
          rangeLabel: "< 100 000 SEK",
          current: netWorth,
          metric: "Nettoförmögenhet"
        },
        {
          level: 2,
          title: "Nivå 2: 100 000 – 1 miljon SEK – Matbutiksfrihet",
          desc: "Matbutiksfrihet. Du kan handla vad du vill i matbutiken utan att oroa dig för kvittot. Du har en buffert och grundläggande vardagstrygghet.",
          strategy: "Nivå 2 ➔ 3: Utbilda dig för högre inkomst",
          target: 1000000,
          rangeLabel: "100 000 – 1 miljon SEK",
          current: netWorth,
          metric: "Nettoförmögenhet"
        },
        {
          level: 3,
          title: "Nivå 3: 1 – 10 miljoner SEK – Restaurangfrihet",
          desc: "Restaurangfrihet. Du kan äta ute och välja vad du vill från menyn utan att titta på priset. Investeringarnas avkastning börjar bli mer betydande än den enskilda lönen.",
          strategy: "Nivå 3 ➔ 4: Investera i inkomstbringande tillgångar",
          target: 10000000,
          rangeLabel: "1 – 10 miljoner SEK",
          current: netWorth,
          metric: "Nettoförmögenhet"
        },
        {
          level: 4,
          title: "Nivå 4: 10 – 100 miljoner SEK – Resefrihet",
          desc: "Resefrihet. Du kan resa och bo hur du vill. Portföljens svängningar på marknaden påverkar förmögenheten mer än den årliga lönen.",
          strategy: "Nivå 4 ➔ 5: Äg ett eget företag",
          target: 100000000,
          rangeLabel: "10 – 100 miljoner SEK",
          current: netWorth,
          metric: "Nettoförmögenhet"
        },
        {
          level: 5,
          title: "Nivå 5: 100 miljoner – 1 miljard SEK – Husfrihet",
          desc: "Husfrihet. Råd med drömboende och flera fastigheter. På denna nivå börjar pengar skapa komplexitet snarare än att bara lösa problem.",
          strategy: "Nivå 5 ➔ 6: Skala upp din verksamhet",
          target: 1000000000,
          rangeLabel: "100 miljoner – 1 miljard SEK",
          current: netWorth,
          metric: "Nettoförmögenhet"
        },
        {
          level: 6,
          title: "Nivå 6: Över 1 miljard SEK – Påverkansfrihet",
          desc: "Påverkansfrihet. Möjlighet att påverka samhället och många människors liv i stor skala. Fokus skiftar helt mot arv, filantropi och mening.",
          strategy: "Nivå 6+: Fokus på arv, filantropi och samhällspåverkan",
          target: Infinity,
          rangeLabel: "> 1 miljard SEK",
          current: netWorth,
          metric: "Nettoförmögenhet"
        }
      ]
    : [
        {
          level: 1,
          title: "Level 1: Under 10,000 USD – Living Paycheck to Paycheck",
          desc: "Living paycheck to paycheck without significant margins. Unexpected expenses cause stress and the solution is to increase income rather than pinching pennies.",
          strategy: "Level 1 ➔ 2: Build sellable skills",
          target: 100000,
          rangeLabel: "< 10,000 USD",
          current: netWorth,
          metric: "Net Worth"
        },
        {
          level: 2,
          title: "Level 2: 10,000 – 100,000 USD – Grocery Freedom",
          desc: "Grocery freedom. You can buy whatever groceries you want without stressing over the receipt. You have an emergency buffer and foundational security.",
          strategy: "Level 2 ➔ 3: Invest in education for higher income",
          target: 1000000,
          rangeLabel: "10,000 – 100,000 USD",
          current: netWorth,
          metric: "Net Worth"
        },
        {
          level: 3,
          title: "Level 3: 100,000 – 1 Million USD – Restaurant Freedom",
          desc: "Restaurant freedom. You can dine out and order whatever you desire without checking the bill. Investment returns start becoming more significant than single paychecks.",
          strategy: "Level 3 ➔ 4: Invest in income-generating assets",
          target: 10000000,
          rangeLabel: "100,000 – 1M USD",
          current: netWorth,
          metric: "Net Worth"
        },
        {
          level: 4,
          title: "Level 4: 1 – 10 Million USD – Travel Freedom",
          desc: "Travel freedom. You can travel and stay wherever you want. Market fluctuations impact your portfolio value more than your annual salary.",
          strategy: "Level 4 ➔ 5: Own a business",
          target: 100000000,
          rangeLabel: "1M – 10M USD",
          current: netWorth,
          metric: "Net Worth"
        },
        {
          level: 5,
          title: "Level 5: 10 – 100 Million USD – House Freedom",
          desc: "House freedom. Affording dream properties and multiple residences. At this level, wealth begins creating operational complexity rather than just solving problems.",
          strategy: "Level 5 ➔ 6: Scale your business",
          target: 1000000000,
          rangeLabel: "10M – 100M USD",
          current: netWorth,
          metric: "Net Worth"
        },
        {
          level: 6,
          title: "Level 6: Over 100 Million USD – Impact Freedom",
          desc: "Impact freedom. The capacity to influence society and thousands of lives at scale. Focus pivots completely toward legacy, philanthropy, and purpose.",
          strategy: "Level 6+: Focus on legacy, philanthropy and societal impact",
          target: Infinity,
          rangeLabel: "> 100M USD",
          current: netWorth,
          metric: "Net Worth"
        }
      ];

  const currentStep = steps.find(s => s.current < s.target) || steps[steps.length - 1];
  const currentLevel = currentStep.level;

  const strategiesSummary = isSv
    ? [
        { fromTo: "Nivå 1 ➔ 2", text: "Bygg säljbara färdigheter", level: 1 },
        { fromTo: "Nivå 2 ➔ 3", text: "Utbilda dig för högre inkomst", level: 2 },
        { fromTo: "Nivå 3 ➔ 4", text: "Investera i inkomstbringande tillgångar", level: 3 },
        { fromTo: "Nivå 4 ➔ 5", text: "Äg ett eget företag", level: 4 },
        { fromTo: "Nivå 5 ➔ 6", text: "Skala upp din verksamhet", level: 5 },
      ]
    : [
        { fromTo: "Level 1 ➔ 2", text: "Build sellable skills", level: 1 },
        { fromTo: "Level 2 ➔ 3", text: "Invest in education for higher income", level: 2 },
        { fromTo: "Level 3 ➔ 4", text: "Invest in income-generating assets", level: 3 },
        { fromTo: "Level 4 ➔ 5", text: "Own a business", level: 4 },
        { fromTo: "Level 5 ➔ 6", text: "Scale your business", level: 5 },
      ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">
          {isSv ? "Rikedomstrappan" : "Wealth Ladder"}
        </h2>
        <p className="text-on-surface-variant font-medium mt-1">
          {isSv
            ? "Mät din resa mot ekonomiskt oberoende baserat på de 6 nivåerna av frihet."
            : "Track your journey to financial independence across the 6 levels of freedom."}
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-outline-variant/20">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            {isSv ? "Total Förmögenhet" : "Total Net Worth"}
          </span>
          <span className="block text-2xl font-extrabold text-on-surface">{formatCurrency(netWorth)}</span>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-outline-variant/20">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            {isSv ? "Snittutgift (månad)" : "Average Expenses (Monthly)"}
          </span>
          <span className="block text-2xl font-extrabold text-on-surface">{formatCurrency(avgMonthlyExpenses)}</span>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-outline-variant/20">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            {isSv ? "Passiv Månadsinkomst" : "Passive Monthly Income"}
          </span>
          <span className="block text-2xl font-extrabold text-primary">{formatCurrency(monthlyPassiveIncome)}</span>
        </div>
        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-ambient border border-emerald-500 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-100 mb-1">
            {isSv ? "Din Aktuella Nivå" : "Your Current Level"}
          </span>
          <span className="block text-3xl font-extrabold font-headline">
            {isSv ? `Nivå ${currentLevel}` : `Level ${currentLevel}`}
          </span>
        </div>
      </div>

      {/* Strategy per level summary roadmap */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-outline-variant/20 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h3 className="text-lg font-bold font-headline text-on-surface">
              {isSv ? "Strategi per nivå" : "Strategy per Level"}
            </h3>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            {isSv
              ? "Hur du tar dig vidare från din nuvarande nivå"
              : "How to progress from your current level"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {strategiesSummary.map((item) => {
            const isCurrentFocus = currentLevel === item.level;
            return (
              <div
                key={item.fromTo}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  isCurrentFocus
                    ? "bg-amber-500/10 border-amber-500/40 ring-2 ring-amber-500/20 shadow-sm"
                    : "bg-surface-container-low/60 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-on-surface">{item.fromTo}</span>
                  {isCurrentFocus && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                      {isSv ? "Ditt fokus" : "Your focus"}
                    </span>
                  )}
                </div>
                <p className="font-medium text-on-surface-variant leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ladder Steps */}
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
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                      <h3 className="text-xl font-bold font-headline text-on-surface">{step.title}</h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {step.rangeLabel}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-on-surface-variant max-w-2xl leading-relaxed">{step.desc}</p>
                    
                    {/* Strategy Callout */}
                    <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-bold">
                      <span>💡</span>
                      <span>{step.strategy}</span>
                    </div>
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-slate-100/60">
                    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest text-slate-500">
                      <span>
                        {isSv ? "Målvärde" : "Target"} ({step.metric}): {step.target === Infinity ? (isSv ? "∞ SEK" : "∞ USD") : formatCurrency(step.target)}
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isPassed ? 'bg-emerald-500' : 'bg-primary'}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end mt-2">
                        <span className="text-xs font-bold text-on-surface-variant">
                          {isSv ? "Du har: " : "You have: "}
                          {formatCurrency(step.current)}
                        </span>
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
