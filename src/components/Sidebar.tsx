"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: "/", label: t("dashboard"), icon: "dashboard" },
    { href: "/buckets", label: t("fourBuckets"), icon: "inventory_2" },
    { href: "/wealth-ladder", label: t("wealthLadder"), icon: "moving" },
    { href: "/spending", label: t("spending"), icon: "payments" },
    { href: "/transactions", label: t("transactions"), icon: "receipt_long" },
    { href: "/upload", label: t("upload"), icon: "upload_file" },
    { href: "/buckets/mapping", label: "Mapping & Scenarios", icon: "tune" },
  ];

  return (
    <aside
      className={`h-screen w-64 fixed left-0 top-0 bg-white dark:bg-slate-950 flex flex-col py-8 px-4 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="mb-10 px-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <div>
            <h1 className="text-lg font-black text-emerald-800 dark:text-emerald-100 font-headline uppercase tracking-widest leading-none">
              Balans
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">
              Growth & Precision
            </p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-500 hover:text-slate-800 p-1">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-transform hover:translate-x-1 duration-200 font-medium text-sm ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-r-4 border-emerald-600"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 space-y-2">
        <Link 
          href="/settings" 
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 text-slate-600 font-medium text-sm hover:text-emerald-600"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          Inställningar / Settings
        </Link>
      </div>
    </aside>
  );
}

