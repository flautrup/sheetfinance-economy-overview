"use client";

import { useTranslation } from "@/lib/i18n";

export function Topbar() {
  const { lang, setLang } = useTranslation();

  return (
    <header className="w-full sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 ml-0 md:pl-72">
      <div className="flex items-center gap-4">
        {/* Only visual search bar for now */}
        <div className="relative hidden md:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">search</span>
          <input 
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary w-64 transition-all" 
            placeholder="Sök..." 
            type="text" 
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setLang(lang === "sv" ? "en" : "sv")}
          className="px-3 py-1 text-xs font-bold bg-surface-container-high rounded-full hover:bg-slate-200 transition-colors"
        >
          {lang === "sv" ? "EN" : "SV"}
        </button>
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 text-emerald-800 font-bold">
          F
        </div>
      </div>
    </header>
  );
}
