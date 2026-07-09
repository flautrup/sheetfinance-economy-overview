"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

type DbStats = {
  transactionCount: number;
  balanceCount: number;
  mappingCount: number;
  scenarioCount: number;
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DbStats | null>(null);
  const [isWiping, setIsWiping] = useState(false);
  const [message, setMessage] = useState("");

  const fetchStats = () => {
    fetch("/api/reset")
      .then((res) => res.json())
      .then((d) => {
        if (!d.error) setStats(d);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleWipeDatabase = async () => {
    const confirm = window.confirm(
      "Är du helt säker? Detta raderar ALLA dina transaktioner, balansräkningar och bucket-inställningar permanent."
    );
    if (!confirm) return;

    setIsWiping(true);
    setMessage("");

    try {
      const res = await fetch("/api/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setMessage("Databasen rensades framgångsrikt!");
        setStats({
          transactionCount: 0,
          balanceCount: 0,
          mappingCount: 0,
          scenarioCount: 0,
        });
      } else {
        setMessage(`Fel: ${data.error}`);
      }
    } catch {
      setMessage("Ett nätverksfel uppstod.");
    } finally {
      setIsWiping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">
          Inställningar & Administration
        </h2>
        <p className="text-on-surface-variant font-medium mt-1">
          Hantera dina anslutningar, databasfiler och kontoinställningar.
        </p>
      </header>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl font-medium">
          {message}
        </div>
      )}

      {/* Account Info */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient border border-white/40">
        <h3 className="text-xl font-bold font-headline mb-6 text-on-surface">Google-konto</h3>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-extrabold text-lg">
              {session?.user?.name ? session.user.name.charAt(0) : "U"}
            </div>
            <div>
              <p className="font-bold text-on-surface">{session?.user?.name || "Användare"}</p>
              <p className="text-sm font-medium text-on-surface-variant">{session?.user?.email || "Inget e-postmeddelande"}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors"
          >
            Logga ut / Sign Out
          </button>
        </div>
      </div>

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient border border-white/40 space-y-6">
          <h3 className="text-xl font-bold font-headline text-on-surface">Systemstatistik</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-container rounded-xl">
              <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Transaktioner
              </span>
              <span className="text-2xl font-extrabold text-on-surface">
                {stats ? stats.transactionCount : "..."}
              </span>
            </div>
            <div className="p-4 bg-surface-container rounded-xl">
              <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Balansposter
              </span>
              <span className="text-2xl font-extrabold text-on-surface">
                {stats ? stats.balanceCount : "..."}
              </span>
            </div>
            <div className="p-4 bg-surface-container rounded-xl">
              <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Mappings
              </span>
              <span className="text-2xl font-extrabold text-on-surface">
                {stats ? stats.mappingCount : "..."}
              </span>
            </div>
            <div className="p-4 bg-surface-container rounded-xl">
              <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Scenarier
              </span>
              <span className="text-2xl font-extrabold text-on-surface">
                {stats ? stats.scenarioCount : "..."}
              </span>
            </div>
          </div>
        </div>

        {/* Database Management / Wipe */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient border border-white/40 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-headline text-on-surface mb-2">Databasrensning</h3>
            <p className="text-sm font-medium text-on-surface-variant leading-relaxed mb-6">
              Rensa alla importerade banktransaktioner, balansräkningar och personliga inställningar från din lokala SQLite-databas.
            </p>
          </div>
          <button
            onClick={handleWipeDatabase}
            disabled={isWiping}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow transition-colors disabled:opacity-50"
          >
            {isWiping ? "Rensar..." : "Rensa all databasinformation"}
          </button>
        </div>
      </div>
    </div>
  );
}
