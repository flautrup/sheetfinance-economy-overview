"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 ml-0 md:ml-64 p-6 md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
