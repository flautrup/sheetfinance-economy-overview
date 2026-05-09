<!-- Design System -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Dashboard Overview | SheetFinance</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed-dim": "#ffb3af",
                    "on-primary-fixed": "#002114",
                    "on-tertiary-fixed-variant": "#842225",
                    "surface": "#f7f9fb",
                    "tertiary-fixed": "#ffdad7",
                    "error-container": "#ffdad6",
                    "inverse-surface": "#2d3133",
                    "secondary": "#515f74",
                    "on-tertiary-container": "#711419",
                    "secondary-fixed-dim": "#b9c7df",
                    "on-surface": "#191c1e",
                    "outline": "#6c7a71",
                    "primary-fixed-dim": "#68dba9",
                    "tertiary": "#a43a3a",
                    "surface-tint": "#006c4a",
                    "on-secondary": "#ffffff",
                    "primary-container": "#3fb687",
                    "on-error": "#ffffff",
                    "on-error-container": "#93000a",
                    "surface-dim": "#d8dadc",
                    "on-primary-container": "#00422c",
                    "surface-variant": "#e0e3e5",
                    "on-secondary-container": "#57657a",
                    "surface-container-high": "#e6e8ea",
                    "on-tertiary-fixed": "#410005",
                    "on-secondary-fixed": "#0d1c2e",
                    "background": "#f7f9fb",
                    "inverse-primary": "#68dba9",
                    "on-primary-fixed-variant": "#005137",
                    "surface-container-low": "#f2f4f6",
                    "surface-container-lowest": "#ffffff",
                    "outline-variant": "#bbcabf",
                    "primary-fixed": "#85f8c4",
                    "surface-container-highest": "#e0e3e5",
                    "error": "#ba1a1a",
                    "tertiary-container": "#fc7c78",
                    "on-primary": "#ffffff",
                    "surface-container": "#eceef0",
                    "on-background": "#191c1e",
                    "inverse-on-surface": "#eff1f3",
                    "on-secondary-fixed-variant": "#3a485b",
                    "primary": "#006c4a",
                    "on-surface-variant": "#3c4a42",
                    "secondary-container": "#d5e3fc",
                    "secondary-fixed": "#d5e3fc",
                    "surface-bright": "#f7f9fb"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Manrope"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-header {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(24px);
        }
        .gradient-primary {
            background: linear-gradient(135deg, #006c4a 0%, #3fb687 100%);
        }
        .shadow-ambient {
            box-shadow: 0 4px 20px rgba(25, 28, 30, 0.04), 0 12px 40px rgba(25, 28, 30, 0.06);
        }
    </style>
</head>
<body class="bg-surface font-body text-on-surface antialiased">
<aside class="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col py-8 px-4 bg-white dark:bg-slate-950 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] z-50">
<div class="mb-10 px-2 flex items-center gap-3">
<div class="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center text-white">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">account_balance</span>
</div>
<div>
<h1 class="text-lg font-black text-emerald-800 tracking-tight leading-none">SheetFinance</h1>
<p class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">Growth &amp; Precision</p>
</div>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600 font-manrope text-sm font-semibold transition-transform active:scale-98" href="#">
<span class="material-symbols-outlined">dashboard</span>
                Dashboard
            </a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:translate-x-1 font-manrope text-sm font-medium transition-all active:scale-98" href="#">
<span class="material-symbols-outlined">inventory_2</span>
                Four Bucket Model
            </a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:translate-x-1 font-manrope text-sm font-medium transition-all active:scale-98" href="#">
<span class="material-symbols-outlined">moving</span>
                Wealth Ladder
            </a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:translate-x-1 font-manrope text-sm font-medium transition-all active:scale-98" href="#">
<span class="material-symbols-outlined">analytics</span>
                General Overview
            </a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:translate-x-1 font-manrope text-sm font-medium transition-all active:scale-98" href="#">
<span class="material-symbols-outlined">payments</span>
                Monthly Spending
            </a>
</nav>
<div class="mt-auto space-y-1">
<div class="p-4 bg-surface-container rounded-xl mb-4">
<p class="text-xs font-semibold text-emerald-900 mb-1">Premium Access</p>
<p class="text-[11px] text-on-surface-variant mb-3">Unlock advanced bucket projections and tax optimization.</p>
<button class="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">Upgrade Plan</button>
</div>
<a class="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-all" href="#">
<span class="material-symbols-outlined">help</span>
                Support
            </a>
<a class="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-all" href="#">
<span class="material-symbols-outlined">settings</span>
                Settings
            </a>
</div>
</aside>
<main class="md:ml-64 min-h-screen flex flex-col">
<header class="w-full sticky top-0 z-40 h-16 glass-header px-6 md:px-10 flex justify-between items-center bg-slate-50/80 backdrop-blur-xl">
<div class="flex items-center gap-6">
<div class="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-80">
<span class="material-symbols-outlined text-outline text-sm">search</span>
<input class="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline-variant" placeholder="Search accounts or buckets..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
<div class="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
<img alt="User profile" data-alt="professional portrait of a man in business casual attire with soft studio lighting and clean background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGJjXLyuS0gn3r6eKyUGcnVi3OlxmvK5GGziNTxxzLBWl_E4YQ3koV0vq7PHRf-kIh58mQWoNUGnuAQfhHTT2kskqruEQ-fr7G012hSEiwv_M6_G0Xp_v-UepN1Bc8anbyY8wNmRzXI5xcPR6-2Bbppf4ipZk0IS8CRRqZaiYuRY_G7DtK2b9Yos3xqyq-w9OzaJYuaLPPz33gQdOqv5DcjPiFuTWz7Wt9PGZjfoS6DOqjiJnoIu-G9r-m7E-ujC5wklqnNk01Av8"/>
</div>
</div>
</header>
<section class="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-10">
<header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 class="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">Financial Overview</h2>
<p class="text-on-surface-variant font-medium mt-1">Status as of October 24, 2024</p>
</div>
<div class="flex gap-2">
<button class="px-5 py-2.5 bg-surface-container-low text-on-surface-variant rounded-lg font-semibold text-sm hover:bg-surface-container-high transition-colors">Generate Report</button>
<button class="px-5 py-2.5 gradient-primary text-white rounded-lg font-semibold text-sm shadow-ambient flex items-center gap-2">
<span class="material-symbols-outlined text-sm">add</span>
                        Link Account
                    </button>
</div>
</header>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-white/40">
<p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 opacity-70">Total Net Worth</p>
<div class="flex items-baseline gap-2">
<h3 class="text-4xl font-extrabold font-headline text-on-surface tracking-tight">$842,500.00</h3>
<span class="text-primary font-bold text-sm flex items-center">
<span class="material-symbols-outlined text-xs">trending_up</span>
                            2.4%
                        </span>
</div>
<div class="mt-6 h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
<div class="h-full bg-primary w-3/4 rounded-full"></div>
</div>
</div>
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-white/40">
<p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 opacity-70">Liquid Capital</p>
<div class="flex items-baseline gap-2">
<h3 class="text-4xl font-extrabold font-headline text-on-surface tracking-tight">$124,320.00</h3>
<span class="text-primary font-bold text-sm flex items-center">
<span class="material-symbols-outlined text-xs">check_circle</span>
                            Safe
                        </span>
</div>
<div class="mt-6 flex justify-between text-[11px] font-bold text-on-surface-variant">
<span>EMERGENCY FUND (6M)</span>
<span class="text-primary">100% FUNDED</span>
</div>
</div>
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-ambient border border-white/40">
<p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 opacity-70">Savings Rate</p>
<div class="flex items-baseline gap-2">
<h3 class="text-4xl font-extrabold font-headline text-on-surface tracking-tight">42.5%</h3>
<span class="text-secondary font-bold text-sm">Avg Monthly</span>
</div>
<div class="mt-6 flex gap-1">
<div class="h-1.5 w-1/4 bg-primary rounded-full"></div>
<div class="h-1.5 w-1/4 bg-primary rounded-full"></div>
<div class="h-1.5 w-1/4 bg-primary/40 rounded-full"></div>
<div class="h-1.5 w-1/4 bg-surface-container-high rounded-full"></div>
</div>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
<div class="lg:col-span-3 bg-surface-container-lowest p-8 rounded-2xl shadow-ambient relative overflow-hidden">
<div class="flex justify-between items-start mb-10">
<div>
<h4 class="text-xl font-bold font-headline text-on-surface">Growth Trajectory</h4>
<p class="text-on-surface-variant text-sm">Projected vs Actual performance</p>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center gap-2">
<div class="w-3 h-3 rounded-full bg-primary"></div>
<span class="text-xs font-bold text-on-surface">Actual</span>
</div>
<div class="flex items-center gap-2">
<div class="w-3 h-3 rounded-full bg-surface-container-highest"></div>
<span class="text-xs font-bold text-on-surface-variant">Projection</span>
</div>
</div>
</div>
<div class="h-80 w-full relative">
<svg class="w-full h-full" preserveaspectratio="none" viewbox="0 0 800 300">
<defs>
<lineargradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#006c4a" stop-opacity="0.2"></stop>
<stop offset="100%" stop-color="#006c4a" stop-opacity="0"></stop>
</lineargradient>
</defs>
<path d="M0 250 Q 100 240, 200 220 T 400 180 T 600 120 T 800 50" fill="transparent" stroke="#006c4a" stroke-linecap="round" stroke-width="4"></path>
<path d="M0 250 Q 100 240, 200 220 T 400 180 T 600 120 T 800 50 L 800 300 L 0 300 Z" fill="url(#chartGradient)"></path>
<path d="M0 260 Q 100 250, 200 240 T 400 210 T 600 170 T 800 130" fill="transparent" stroke="#e0e3e5" stroke-dasharray="8,4" stroke-width="2"></path>
<circle cx="200" cy="220" fill="#ffffff" r="6" stroke="#006c4a" stroke-width="3"></circle>
<circle cx="400" cy="180" fill="#ffffff" r="6" stroke="#006c4a" stroke-width="3"></circle>
<circle cx="600" cy="120" fill="#ffffff" r="6" stroke="#006c4a" stroke-width="3"></circle>
</svg>
<div class="flex justify-between mt-4 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
<span>Jan</span>
<span>Mar</span>
<span>May</span>
<span>Jul</span>
<span>Sep</span>
<span>Nov</span>
</div>
</div>
</div>
<div class="lg:col-span-1 space-y-6">
<div class="bg-surface-container-high p-6 rounded-2xl">
<h4 class="text-sm font-bold text-on-surface uppercase tracking-widest mb-4">Asset Mix</h4>
<div class="space-y-4">
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-emerald-700"></div>
<span class="text-xs font-semibold">Equities</span>
</div>
<span class="text-xs font-bold">65%</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-emerald-400"></div>
<span class="text-xs font-semibold">Real Estate</span>
</div>
<span class="text-xs font-bold">20%</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-slate-400"></div>
<span class="text-xs font-semibold">Cash</span>
</div>
<span class="text-xs font-bold">10%</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-tertiary"></div>
<span class="text-xs font-semibold">Alternatives</span>
</div>
<span class="text-xs font-bold">5%</span>
</div>
</div>
<div class="mt-6 flex justify-center">
<div class="w-32 h-32 rounded-full border-[12px] border-emerald-700 relative">
<div class="absolute inset-0 rounded-full border-[12px] border-emerald-400 border-t-transparent border-l-transparent"></div>
<div class="absolute inset-0 flex items-center justify-center flex-col">
<span class="text-xs font-black">Mixed</span>
</div>
</div>
</div>
</div>
<div class="bg-primary text-white p-6 rounded-2xl shadow-ambient">
<div class="flex items-center gap-3 mb-3">
<span class="material-symbols-outlined">lightbulb</span>
<h4 class="text-sm font-bold">Smart Insight</h4>
</div>
<p class="text-xs leading-relaxed opacity-90">Your cash bucket is currently exceeding its target. Consider rebalancing into the Growth Bucket to capture market momentum.</p>
<button class="mt-4 text-[10px] font-black uppercase tracking-tighter hover:underline">Take Action →</button>
</div>
</div>
</div>
<div class="bg-surface-container p-1 rounded-2xl">
<div class="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
<h4 class="text-xl font-bold font-headline mb-6">Recent Wealth Events</h4>
<div class="space-y-4">
<div class="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">add_chart</span>
</div>
<div>
<p class="text-sm font-bold">Vanguard 500 Dividend</p>
<p class="text-[11px] text-on-surface-variant font-medium">Automatic Reinvestment</p>
</div>
</div>
<div class="text-right">
<p class="text-sm font-bold text-primary">+$1,450.24</p>
<p class="text-[11px] text-on-surface-variant">2 hours ago</p>
</div>
</div>
<div class="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined">account_balance_wallet</span>
</div>
<div>
<p class="text-sm font-bold">Mortgage Payment</p>
<p class="text-[11px] text-on-surface-variant font-medium">Main Residence Bucket</p>
</div>
</div>
<div class="text-right">
<p class="text-sm font-bold">-$3,200.00</p>
<p class="text-[11px] text-on-surface-variant">Yesterday</p>
</div>
</div>
<div class="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined">trending_down</span>
</div>
<div>
<p class="text-sm font-bold">Crypto Market Adjustment</p>
<p class="text-[11px] text-on-surface-variant font-medium">Volatile Bucket Shift</p>
</div>
</div>
<div class="text-right">
<p class="text-sm font-bold text-tertiary">-$842.10</p>
<p class="text-[11px] text-on-surface-variant">Oct 22, 2024</p>
</div>
</div>
</div>
</div>
</div>
</section>
<footer class="w-full py-6 mt-auto flex flex-row justify-between items-center px-6 md:px-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-inter text-xs text-slate-500">
<div class="flex items-center gap-4">
<p class="font-bold text-slate-900 dark:text-slate-100">SheetFinance</p>
<p>© 2024 SheetFinance. All rights reserved.</p>
</div>
<div class="flex gap-6">
<a class="text-slate-400 hover:text-emerald-500 transition-colors" href="#">Legal</a>
<a class="text-slate-400 hover:text-emerald-500 transition-colors" href="#">Privacy Policy</a>
<a class="text-slate-400 hover:text-emerald-500 transition-colors" href="#">System Status</a>
</div>
</footer>
</main>
<div class="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center h-16 z-50">
<button class="flex flex-col items-center text-emerald-600">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>
<span class="text-[10px] font-bold">Home</span>
</button>
<button class="flex flex-col items-center text-slate-400">
<span class="material-symbols-outlined">analytics</span>
<span class="text-[10px] font-bold">Stats</span>
</button>
<button class="w-12 h-12 gradient-primary rounded-full -mt-8 flex items-center justify-center text-white shadow-lg">
<span class="material-symbols-outlined">add</span>
</button>
<button class="flex flex-col items-center text-slate-400">
<span class="material-symbols-outlined">account_balance_wallet</span>
<span class="text-[10px] font-bold">Buckets</span>
</button>
<button class="flex flex-col items-center text-slate-400">
<span class="material-symbols-outlined">person</span>
<span class="text-[10px] font-bold">Profile</span>
</button>
</div>
</body></html>

<!-- Dashboard Overview (Modern) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SheetFinance | Four Bucket Model</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;family=Inter:wght@300;400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed-dim": "#ffb3af",
                    "on-primary-fixed": "#002114",
                    "on-tertiary-fixed-variant": "#842225",
                    "surface": "#f7f9fb",
                    "tertiary-fixed": "#ffdad7",
                    "error-container": "#ffdad6",
                    "inverse-surface": "#2d3133",
                    "secondary": "#515f74",
                    "on-tertiary-container": "#711419",
                    "secondary-fixed-dim": "#b9c7df",
                    "on-surface": "#191c1e",
                    "outline": "#6c7a71",
                    "primary-fixed-dim": "#68dba9",
                    "tertiary": "#a43a3a",
                    "surface-tint": "#006c4a",
                    "on-secondary": "#ffffff",
                    "primary-container": "#3fb687",
                    "on-error": "#ffffff",
                    "on-error-container": "#93000a",
                    "surface-dim": "#d8dadc",
                    "on-primary-container": "#00422c",
                    "surface-variant": "#e0e3e5",
                    "on-secondary-container": "#57657a",
                    "surface-container-high": "#e6e8ea",
                    "on-tertiary-fixed": "#410005",
                    "on-secondary-fixed": "#0d1c2e",
                    "background": "#f7f9fb",
                    "inverse-primary": "#68dba9",
                    "on-primary-fixed-variant": "#005137",
                    "surface-container-low": "#f2f4f6",
                    "surface-container-lowest": "#ffffff",
                    "outline-variant": "#bbcabf",
                    "primary-fixed": "#85f8c4",
                    "surface-container-highest": "#e0e3e5",
                    "error": "#ba1a1a",
                    "tertiary-container": "#fc7c78",
                    "on-primary": "#ffffff",
                    "surface-container": "#eceef0",
                    "on-background": "#191c1e",
                    "inverse-on-surface": "#eff1f3",
                    "on-secondary-fixed-variant": "#3a485b",
                    "primary": "#006c4a",
                    "on-surface-variant": "#3c4a42",
                    "secondary-container": "#d5e3fc",
                    "secondary-fixed": "#d5e3fc",
                    "surface-bright": "#f7f9fb"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Manrope"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .emerald-pulse-gradient {
            background: linear-gradient(135deg, #006c4a 0%, #3fb687 100%);
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(24px);
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body antialiased">
<!-- SideNavBar Shell -->
<aside class="h-screen w-64 fixed left-0 top-0 bg-white dark:bg-slate-950 flex flex-col py-8 px-4 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] z-50">
<div class="mb-10 px-2">
<h1 class="text-lg font-black text-emerald-800 dark:text-emerald-100 font-headline uppercase tracking-widest">SheetFinance</h1>
<p class="text-xs text-slate-500 font-medium">Growth &amp; Precision</p>
</div>
<nav class="flex-1 space-y-2">
<!-- Nav Items mapped from JSON -->
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-transform hover:translate-x-1 duration-200 font-medium text-sm" href="#">
<span class="material-symbols-outlined text-lg">dashboard</span>
                Dashboard
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-r-4 border-emerald-600 transition-transform hover:translate-x-1 duration-200 font-medium text-sm" href="#">
<span class="material-symbols-outlined text-lg">inventory_2</span>
                Four Bucket Model
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-transform hover:translate-x-1 duration-200 font-medium text-sm" href="#">
<span class="material-symbols-outlined text-lg">moving</span>
                Wealth Ladder
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-transform hover:translate-x-1 duration-200 font-medium text-sm" href="#">
<span class="material-symbols-outlined text-lg">analytics</span>
                General Overview
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-transform hover:translate-x-1 duration-200 font-medium text-sm" href="#">
<span class="material-symbols-outlined text-lg">payments</span>
                Monthly Spending
            </a>
</nav>
<div class="mt-auto pt-6 space-y-2">
<div class="px-2 mb-4">
<button class="w-full py-2 px-4 rounded-lg emerald-pulse-gradient text-white font-semibold text-sm active:scale-95 transition-all shadow-lg">
                    Upgrade Plan
                </button>
</div>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 font-medium text-sm hover:text-emerald-600" href="#">
<span class="material-symbols-outlined text-lg">help</span>
                Support
            </a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 font-medium text-sm hover:text-emerald-600" href="#">
<span class="material-symbols-outlined text-lg">settings</span>
                Settings
            </a>
</div>
</aside>
<!-- TopNavBar Shell -->
<header class="w-full sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 ml-0 md:pl-72">
<div class="flex items-center gap-4">
<div class="relative">
<span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
<input class="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary w-64 transition-all" placeholder="Search accounts..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-slate-100 text-slate-500">
<span class="material-symbols-outlined">settings</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-emerald-100">
<img alt="User profile" class="w-full h-full object-cover" data-alt="professional portrait of a financial advisor in a modern office with natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9D_hozc1DotnYnC7ukhHZY9M-ukuLLM0N07ogUVIoubLn3H7v9TtTIqulSFISCeupFLm54CeWOmx5aKZP2SEZuclF-T5yjeZDyLpB7SupYWssdujclqDpbJQEXdKKnUrI047n_WjYeRyDs6Bh9hBPTlqBLP2ffF8nnHp88nmj-WKHdRW9D1o5hr2dSpk9gV2RaMlCuIR5O4yNO4igZWBkDYOkV2RMW1H9kOWPb74S2uyLzNsXtAE-2QGTnzjGwCT-jekWNrHjOag"/>
</div>
</div>
</header>
<!-- Main Content Area -->
<main class="ml-64 p-12 min-h-screen">
<!-- Header Section -->
<section class="mb-12 max-w-6xl">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h2 class="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-2">Four Bucket Model</h2>
<p class="text-on-surface-variant max-w-xl font-medium leading-relaxed">
                        Strategically allocate your capital across four distinct liquidity and risk profiles. This model ensures your immediate needs are met while aggressively pursuing long-term growth.
                    </p>
</div>
<div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center gap-6">
<div class="text-right">
<span class="block text-xs font-bold uppercase tracking-widest text-primary mb-1">Total Assets</span>
<span class="text-3xl font-extrabold font-headline">$1,248,500.00</span>
</div>
<div class="h-12 w-[1px] bg-outline-variant opacity-30"></div>
<div class="text-right">
<span class="block text-xs font-bold uppercase tracking-widest text-secondary mb-1">Yield (AVG)</span>
<span class="text-3xl font-extrabold font-headline text-primary">6.8%</span>
</div>
</div>
</div>
</section>
<!-- Bento Grid: The Four Buckets -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-7xl">
<!-- Bucket 1: Buffer -->
<div class="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border-t-4 border-emerald-400">
<div class="flex justify-between items-start mb-6">
<div class="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
<span class="material-symbols-outlined text-3xl">shield</span>
</div>
<span class="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded uppercase">Safe</span>
</div>
<h3 class="text-xl font-bold font-headline mb-2">Buffer</h3>
<p class="text-sm text-on-surface-variant mb-6 leading-snug">Emergency funds and next 12 months of living expenses.</p>
<div class="mt-auto space-y-4">
<div class="flex justify-between items-end">
<span class="text-2xl font-bold">$45,000</span>
<span class="text-xs font-semibold text-on-surface-variant">Target: $50k</span>
</div>
<div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-emerald-500 w-[90%]"></div>
</div>
<p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Allocation: 3.6%</p>
</div>
</div>
<!-- Bucket 2: Passive -->
<div class="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border-t-4 border-emerald-600">
<div class="flex justify-between items-start mb-6">
<div class="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
<span class="material-symbols-outlined text-3xl">account_balance</span>
</div>
<span class="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded uppercase">Steady</span>
</div>
<h3 class="text-xl font-bold font-headline mb-2">Passive</h3>
<p class="text-sm text-on-surface-variant mb-6 leading-snug">Diversified index funds and high-yield real estate notes.</p>
<div class="mt-auto space-y-4">
<div class="flex justify-between items-end">
<span class="text-2xl font-bold">$820,000</span>
<span class="text-xs font-semibold text-on-surface-variant">Target: $1.0M</span>
</div>
<div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-emerald-700 w-[82%]"></div>
</div>
<p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Allocation: 65.7%</p>
</div>
</div>
<!-- Bucket 3: Active -->
<div class="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border-t-4 border-emerald-800">
<div class="flex justify-between items-start mb-6">
<div class="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-900">
<span class="material-symbols-outlined text-3xl">rocket_launch</span>
</div>
<span class="text-xs font-bold px-2 py-1 bg-emerald-900 text-emerald-50 rounded uppercase">Growth</span>
</div>
<h3 class="text-xl font-bold font-headline mb-2">Active</h3>
<p class="text-sm text-on-surface-variant mb-6 leading-snug">Private equity, business ventures, and concentrated stocks.</p>
<div class="mt-auto space-y-4">
<div class="flex justify-between items-end">
<span class="text-2xl font-bold">$315,000</span>
<span class="text-xs font-semibold text-on-surface-variant">Target: $250k</span>
</div>
<div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-emerald-900 w-full"></div>
</div>
<p class="text-[10px] uppercase font-bold text-tertiary tracking-wider">Over-allocated: 25.2%</p>
</div>
</div>
<!-- Bucket 4: Play -->
<div class="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border-t-4 border-slate-300">
<div class="flex justify-between items-start mb-6">
<div class="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
<span class="material-symbols-outlined text-3xl">celebration</span>
</div>
<span class="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">Lifestyle</span>
</div>
<h3 class="text-xl font-bold font-headline mb-2">Play</h3>
<p class="text-sm text-on-surface-variant mb-6 leading-snug">Short-term luxury, travel, and speculative high-risk bets.</p>
<div class="mt-auto space-y-4">
<div class="flex justify-between items-end">
<span class="text-2xl font-bold">$68,500</span>
<span class="text-xs font-semibold text-on-surface-variant">Target: $50k</span>
</div>
<div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-slate-400 w-full"></div>
</div>
<p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Allocation: 5.5%</p>
</div>
</div>
</div>
<!-- Dynamic Rebalancing Protocol Section -->
<section class="max-w-7xl mb-12">
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
<!-- Rebalancing Action Card -->
<div class="lg:col-span-2 bg-surface-container-low rounded-xl p-8 relative overflow-hidden group">
<div class="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
<div class="relative z-10">
<h3 class="text-2xl font-extrabold font-headline mb-4 tracking-tight">Dynamic Rebalancing Protocol</h3>
<p class="text-on-surface-variant font-medium mb-8 max-w-lg">
                            The system has detected a deviation in your <span class="text-primary font-bold">Active</span> bucket surplus. Recommend shifting excess capital to bolster the <span class="text-emerald-700 font-bold">Passive</span> foundation.
                        </p>
<div class="space-y-6">
<div class="flex items-center gap-8 bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-emerald-50">
<div class="flex-1">
<div class="flex justify-between mb-2">
<span class="text-sm font-bold">Transfer from Active</span>
<span class="text-sm font-bold text-primary">-$65,000</span>
</div>
<div class="w-full h-1 bg-surface-container rounded-full">
<div class="h-full bg-tertiary w-1/3"></div>
</div>
</div>
<span class="material-symbols-outlined text-slate-300">arrow_forward_ios</span>
<div class="flex-1">
<div class="flex justify-between mb-2">
<span class="text-sm font-bold">Deposit to Passive</span>
<span class="text-sm font-bold text-primary">+$65,000</span>
</div>
<div class="w-full h-1 bg-surface-container rounded-full">
<div class="h-full bg-emerald-500 w-1/2"></div>
</div>
</div>
</div>
<div class="flex gap-4">
<button class="px-8 py-3 emerald-pulse-gradient text-white font-bold rounded-lg hover:shadow-xl transition-all active:scale-95">Execute Protocol</button>
<button class="px-8 py-3 bg-surface-container-highest text-on-surface font-bold rounded-lg hover:bg-slate-300 transition-colors">Review Manually</button>
</div>
</div>
</div>
</div>
<!-- Analysis Summary -->
<div class="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
<h4 class="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Portfolio Health</h4>
<div class="space-y-8">
<div>
<div class="flex justify-between items-center mb-2">
<span class="text-sm font-semibold">Bucket Alignment</span>
<span class="text-sm font-bold text-primary">88%</span>
</div>
<div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div class="h-full bg-emerald-500 w-[88%]"></div>
</div>
</div>
<div>
<div class="flex justify-between items-center mb-2">
<span class="text-sm font-semibold">Capital Efficiency</span>
<span class="text-sm font-bold text-primary">94%</span>
</div>
<div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div class="h-full bg-emerald-600 w-[94%]"></div>
</div>
</div>
<div>
<div class="flex justify-between items-center mb-2">
<span class="text-sm font-semibold">Tax Optimization</span>
<span class="text-sm font-bold text-primary">72%</span>
</div>
<div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div class="h-full bg-emerald-400 w-[72%]"></div>
</div>
</div>
<div class="pt-4 border-t border-slate-50 mt-4">
<p class="text-xs text-on-surface-variant leading-relaxed">
<span class="font-bold text-primary">Expert Insight:</span> Your current passive yield is sufficient to cover 42% of lifestyle expenses. Adding $65k to Passive increases this to 45.8%.
                            </p>
</div>
</div>
</div>
</div>
</section>
<!-- Allocation Visualization (Conceptual Editorial Area) -->
<section class="max-w-7xl">
<div class="bg-white rounded-2xl p-10 overflow-hidden relative border border-emerald-50/50">
<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
<div>
<span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-tighter rounded-full mb-4">Allocation Visualization</span>
<h3 class="text-3xl font-extrabold font-headline mb-6 tracking-tighter">Your Wealth Atmosphere</h3>
<p class="text-on-surface-variant font-medium mb-8 leading-relaxed">
                            Visualizing capital not as stagnant piles, but as a circular flow. The "No-Line" rule applies here; let the data breath in its own space.
                        </p>
<div class="flex gap-4">
<div class="flex items-center gap-2">
<div class="w-3 h-3 rounded-full bg-emerald-400"></div>
<span class="text-xs font-bold text-slate-500">Buffer</span>
</div>
<div class="flex items-center gap-2">
<div class="w-3 h-3 rounded-full bg-emerald-600"></div>
<span class="text-xs font-bold text-slate-500">Passive</span>
</div>
<div class="flex items-center gap-2">
<div class="w-3 h-3 rounded-full bg-emerald-900"></div>
<span class="text-xs font-bold text-slate-500">Active</span>
</div>
<div class="flex items-center gap-2">
<div class="w-3 h-3 rounded-full bg-slate-300"></div>
<span class="text-xs font-bold text-slate-500">Play</span>
</div>
</div>
</div>
<div class="relative h-64 flex items-center justify-center">
<div class="absolute w-56 h-56 rounded-full border-[16px] border-emerald-500 border-t-emerald-900 border-r-emerald-700 opacity-20"></div>
<div class="absolute w-40 h-40 rounded-full border-[12px] border-emerald-400 border-l-slate-200 opacity-40"></div>
<div class="text-center z-10">
<span class="block text-4xl font-black font-headline text-emerald-900">$1.2M</span>
<span class="text-xs font-bold text-slate-400 uppercase tracking-widest">AUM Total</span>
</div>
<img class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-10" data-alt="abstract flowing organic liquid shapes in shades of emerald green and white representing wealth flow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWL9hQeVJGAA72_-JSBrclh1iGuJCpkfq8bEiNTqSYyQykOdHu0_JxQ_2qWv2QAsDmEwe81tBIk9JW7M_EQMNmtJVT6GMdyKTrJW7FF2lrU7zxLaEpPDgeH8orvEYmqRk4eXynEsvHR5CPvGcI6bRlFea-EXmUY3jyQSbWAxhLf17kfwWkfPyg1I1DlpUiSh5xgYk8dVoFs1nyhn_chTbpexxCP-jcM9NameUwrCIztE_qOTFcyYrUxUZ0ceodxF-kSWNG88kzBmU"/>
</div>
</div>
</div>
</section>
</main>
<!-- Footer Shell -->
<footer class="w-full py-6 mt-auto flex flex-row justify-between items-center px-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 ml-0 md:pl-72">
<p class="font-inter text-xs text-slate-500 dark:text-slate-400">© 2024 SheetFinance. All rights reserved.</p>
<div class="flex gap-6">
<a class="font-inter text-xs text-slate-400 hover:text-emerald-500 transition-colors" href="#">Legal</a>
<a class="font-inter text-xs text-slate-400 hover:text-emerald-500 transition-colors" href="#">Privacy Policy</a>
<a class="font-inter text-xs text-slate-400 hover:text-emerald-500 transition-colors" href="#">System Status</a>
</div>
</footer>
</body></html>

<!-- Four Bucket Model (Modern) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Monthly Spending - SheetFinance</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;family=Inter:wght@300;400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-tertiary": "#ffffff",
                        "tertiary-fixed-dim": "#ffb3af",
                        "on-primary-fixed": "#002114",
                        "on-tertiary-fixed-variant": "#842225",
                        "surface": "#f7f9fb",
                        "tertiary-fixed": "#ffdad7",
                        "error-container": "#ffdad6",
                        "inverse-surface": "#2d3133",
                        "secondary": "#515f74",
                        "on-tertiary-container": "#711419",
                        "secondary-fixed-dim": "#b9c7df",
                        "on-surface": "#191c1e",
                        "outline": "#6c7a71",
                        "primary-fixed-dim": "#68dba9",
                        "tertiary": "#a43a3a",
                        "surface-tint": "#006c4a",
                        "on-secondary": "#ffffff",
                        "primary-container": "#3fb687",
                        "on-error": "#ffffff",
                        "on-error-container": "#93000a",
                        "surface-dim": "#d8dadc",
                        "on-primary-container": "#00422c",
                        "surface-variant": "#e0e3e5",
                        "on-secondary-container": "#57657a",
                        "surface-container-high": "#e6e8ea",
                        "on-tertiary-fixed": "#410005",
                        "on-secondary-fixed": "#0d1c2e",
                        "background": "#f7f9fb",
                        "inverse-primary": "#68dba9",
                        "on-primary-fixed-variant": "#005137",
                        "surface-container-low": "#f2f4f6",
                        "surface-container-lowest": "#ffffff",
                        "outline-variant": "#bbcabf",
                        "primary-fixed": "#85f8c4",
                        "surface-container-highest": "#e0e3e5",
                        "error": "#ba1a1a",
                        "tertiary-container": "#fc7c78",
                        "on-primary": "#ffffff",
                        "surface-container": "#eceef0",
                        "on-background": "#191c1e",
                        "inverse-on-surface": "#eff1f3",
                        "on-secondary-fixed-variant": "#3a485b",
                        "primary": "#006c4a",
                        "on-surface-variant": "#3c4a42",
                        "secondary-container": "#d5e3fc",
                        "secondary-fixed": "#d5e3fc",
                        "surface-bright": "#f7f9fb"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Manrope"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                },
            },
        }
    </script>
<style>
        .glass-effect {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(24px);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .text-editorial-tight {
            letter-spacing: -0.02em;
        }
    </style>
</head>
<body class="bg-surface font-body text-on-surface">
<!-- SideNavBar Component -->
<aside class="h-screen w-64 fixed left-0 top-0 bg-white dark:bg-slate-950 flex flex-col h-full py-8 px-4 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] z-40">
<div class="mb-10 px-4">
<h1 class="text-lg font-black text-emerald-800 dark:text-emerald-100 font-headline">SheetFinance</h1>
<p class="text-xs text-slate-500 font-medium tracking-wide">Growth &amp; Precision</p>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:translate-x-1 transition-transform duration-200 font-manrope text-sm font-medium" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                Dashboard
            </a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:translate-x-1 transition-transform duration-200 font-manrope text-sm font-medium" href="#">
<span class="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
                Four Bucket Model
            </a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:translate-x-1 transition-transform duration-200 font-manrope text-sm font-medium" href="#">
<span class="material-symbols-outlined" data-icon="moving">moving</span>
                Wealth Ladder
            </a>
<a class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:translate-x-1 transition-transform duration-200 font-manrope text-sm font-medium" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
                General Overview
            </a>
<a class="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600 hover:translate-x-1 transition-transform duration-200 font-manrope text-sm font-medium" href="#">
<span class="material-symbols-outlined" data-icon="payments">payments</span>
                Monthly Spending
            </a>
</nav>
<div class="mt-auto space-y-1 pt-6">
<div class="px-4 mb-4">
<button class="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-2.5 rounded-lg text-sm font-semibold shadow-sm active:scale-95 transition-all">
                    Upgrade Plan
                </button>
</div>
<a class="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-emerald-500 text-sm font-medium transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="help">help</span>
                Support
            </a>
<a class="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-emerald-500 text-sm font-medium transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
                Settings
            </a>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="ml-64 min-h-screen flex flex-col">
<!-- TopNavBar -->
<header class="w-full sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 shadow-sm font-manrope antialiased tracking-tight">
<div class="flex items-center gap-6">
<div class="flex items-center gap-3 bg-surface-container-low px-4 py-1.5 rounded-full">
<span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Period</span>
<select class="bg-transparent border-none focus:ring-0 text-sm font-semibold text-emerald-700 p-0">
<option>October 2024</option>
<option>September 2024</option>
</select>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors duration-200 active:opacity-80">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<div class="h-8 w-8 rounded-full overflow-hidden border-2 border-emerald-100">
<img alt="User profile" data-alt="close-up portrait of a professional man with a friendly expression in a brightly lit modern office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSTXXoAcWr1gFZwEsvnOrIhzB83hdAm2SbCaLXhkY8y4ZPhuAD-57kyV4PUJYOY3QVGwVxLa33s9FB6DkHxEPZWByNLe0CQ7P9DtWlQFhd1g5WR3gIxQzO0sFJd8a-QruDRzwh_Z_xNEYrQ9XUCEKcwNvv5DdjU1yflrGwQ_7mh--F_WEKUnBY4j9QJ8znCVP3jq-xUyF-zG0e8eNwWbM5FawjaauqVsD_5IlhuCcbjgUKGbYbhFPc0b2TQFMRLcwc6U3PoRoJwxk"/>
</div>
</div>
</header>
<section class="p-8 space-y-8">
<!-- Header Editorial Section -->
<div class="flex justify-between items-end">
<div>
<h2 class="text-4xl font-extrabold font-headline text-on-surface text-editorial-tight">Monthly Spending</h2>
<p class="text-on-surface-variant mt-2 max-w-md">Your financial footprint for October. Precision-tracked across all buckets.</p>
</div>
<div class="text-right">
<span class="text-label-md text-on-surface-variant block uppercase tracking-widest font-semibold text-[10px]">Total Outflow</span>
<span class="text-4xl font-bold text-primary font-headline">$4,280.50</span>
</div>
</div>
<!-- Bento Grid Layout -->
<div class="grid grid-cols-12 gap-6">
<!-- Category Chart Card (Asymmetric Large) -->
<div class="col-span-8 bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden">
<h3 class="text-lg font-bold font-headline mb-6">Spending by Category</h3>
<div class="flex items-center gap-12">
<div class="relative w-48 h-48">
<!-- SVG Donut Chart Placeholder -->
<svg class="w-full h-full transform -rotate-90">
<circle cx="50%" cy="50%" fill="transparent" r="40%" stroke="#eceef0" stroke-width="20"></circle>
<circle cx="50%" cy="50%" fill="transparent" r="40%" stroke="#006c4a" stroke-dasharray="180 251" stroke-width="20"></circle>
<circle cx="50%" cy="50%" fill="transparent" r="40%" stroke="#3fb687" stroke-dasharray="60 251" stroke-dashoffset="-180" stroke-width="20"></circle>
<circle cx="50%" cy="50%" fill="transparent" r="40%" stroke="#a43a3a" stroke-dasharray="30 251" stroke-dashoffset="-240" stroke-width="20"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-2xl font-black font-headline text-on-surface">62%</span>
<span class="text-[10px] uppercase font-bold text-slate-400">Fixed</span>
</div>
</div>
<div class="flex-1 grid grid-cols-2 gap-4">
<div class="p-4 rounded-lg bg-surface-container-low border-l-4 border-primary">
<p class="text-xs font-semibold text-on-surface-variant">Housing &amp; Utilities</p>
<p class="text-xl font-bold text-on-surface">$2,450.00</p>
</div>
<div class="p-4 rounded-lg bg-surface-container-low border-l-4 border-primary-container">
<p class="text-xs font-semibold text-on-surface-variant">Food &amp; Dining</p>
<p class="text-xl font-bold text-on-surface">$820.40</p>
</div>
<div class="p-4 rounded-lg bg-surface-container-low border-l-4 border-tertiary">
<p class="text-xs font-semibold text-on-surface-variant">Entertainment</p>
<p class="text-xl font-bold text-on-surface">$410.10</p>
</div>
<div class="p-4 rounded-lg bg-surface-container-low border-l-4 border-slate-300">
<p class="text-xs font-semibold text-on-surface-variant">Others</p>
<p class="text-xl font-bold text-on-surface">$599.90</p>
</div>
</div>
</div>
</div>
<!-- AI Insights Sidebar -->
<div class="col-span-4 flex flex-col gap-6">
<div class="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl text-on-primary shadow-lg">
<div class="flex items-center gap-2 mb-3">
<span class="material-symbols-outlined text-lg" data-icon="auto_awesome" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
<h3 class="font-bold text-sm uppercase tracking-wider">AI Insight</h3>
</div>
<p class="text-sm leading-relaxed opacity-90">You spent 12% less on dining this month. Redirecting $150 to your 'Growth Bucket' could accelerate your ladder progress by 2 months.</p>
</div>
<div class="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
<div class="flex items-center gap-2 mb-3 text-on-surface">
<span class="material-symbols-outlined text-lg" data-icon="trending_down">trending_down</span>
<h3 class="font-bold text-sm uppercase tracking-wider">Burn Rate</h3>
</div>
<p class="text-2xl font-black font-headline">$142/day</p>
<p class="text-xs text-on-surface-variant mt-1">Efficient. Below your $160 threshold.</p>
</div>
</div>
<!-- Transactions Table Module -->
<div class="col-span-12 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
<div class="px-8 py-6 flex justify-between items-center border-b border-surface-container">
<h3 class="text-lg font-bold font-headline">Recent Transactions</h3>
<div class="flex gap-2">
<button class="px-4 py-1.5 text-xs font-bold rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container transition-colors">Export CSV</button>
<button class="px-4 py-1.5 text-xs font-bold rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">View All</button>
</div>
</div>
<table class="w-full text-left">
<thead>
<tr class="bg-surface-container-low/50">
<th class="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date</th>
<th class="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Description</th>
<th class="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
<th class="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Amount</th>
<th class="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Status</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-low">
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-8 py-5 text-sm text-on-surface-variant">Oct 24, 2024</td>
<td class="px-8 py-5 text-sm font-semibold text-on-surface">Amazon Marketplace</td>
<td class="px-8 py-5">
<span class="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium">Household</span>
</td>
<td class="px-8 py-5 text-sm font-bold text-right text-on-surface">-$124.50</td>
<td class="px-8 py-5 text-center">
<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">CLEARED</span>
</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-8 py-5 text-sm text-on-surface-variant">Oct 23, 2024</td>
<td class="px-8 py-5 text-sm font-semibold text-on-surface">Whole Foods Market</td>
<td class="px-8 py-5">
<span class="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-medium">Groceries</span>
</td>
<td class="px-8 py-5 text-sm font-bold text-right text-on-surface">-$82.10</td>
<td class="px-8 py-5 text-center">
<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">CLEARED</span>
</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-8 py-5 text-sm text-on-surface-variant">Oct 22, 2024</td>
<td class="px-8 py-5 text-sm font-semibold text-on-surface">Spotify Premium</td>
<td class="px-8 py-5">
<span class="text-xs px-2 py-1 rounded bg-tertiary/10 text-tertiary font-medium">Entertainment</span>
</td>
<td class="px-8 py-5 text-sm font-bold text-right text-on-surface">-$14.99</td>
<td class="px-8 py-5 text-center">
<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-secondary">PENDING</span>
</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-8 py-5 text-sm text-on-surface-variant">Oct 21, 2024</td>
<td class="px-8 py-5 text-sm font-semibold text-on-surface">Chevron Station #42</td>
<td class="px-8 py-5">
<span class="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium">Transport</span>
</td>
<td class="px-8 py-5 text-sm font-bold text-right text-on-surface">-$65.00</td>
<td class="px-8 py-5 text-center">
<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">CLEARED</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
<!-- Footer -->
<footer class="w-full py-6 mt-auto bg-slate-50 flex flex-row justify-between items-center px-12 border-t border-slate-200 font-inter text-xs text-slate-500">
<div class="flex items-center gap-4">
<span class="font-bold text-slate-900">SheetFinance</span>
<span>© 2024 SheetFinance. All rights reserved.</span>
</div>
<div class="flex gap-6">
<a class="text-slate-400 hover:text-emerald-600 transition-colors" href="#">Legal</a>
<a class="text-slate-400 hover:text-emerald-600 transition-colors" href="#">Privacy Policy</a>
<a class="text-slate-400 hover:text-emerald-600 transition-colors" href="#">System Status</a>
</div>
</footer>
</main>
</body></html>

<!-- Monthly Spending (Modern) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Wealth Ladder | SheetFinance</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed-dim": "#ffb3af",
                    "on-primary-fixed": "#002114",
                    "on-tertiary-fixed-variant": "#842225",
                    "surface": "#f7f9fb",
                    "tertiary-fixed": "#ffdad7",
                    "error-container": "#ffdad6",
                    "inverse-surface": "#2d3133",
                    "secondary": "#515f74",
                    "on-tertiary-container": "#711419",
                    "secondary-fixed-dim": "#b9c7df",
                    "on-surface": "#191c1e",
                    "outline": "#6c7a71",
                    "primary-fixed-dim": "#68dba9",
                    "tertiary": "#a43a3a",
                    "surface-tint": "#006c4a",
                    "on-secondary": "#ffffff",
                    "primary-container": "#3fb687",
                    "on-error": "#ffffff",
                    "on-error-container": "#93000a",
                    "surface-dim": "#d8dadc",
                    "on-primary-container": "#00422c",
                    "surface-variant": "#e0e3e5",
                    "on-secondary-container": "#57657a",
                    "surface-container-high": "#e6e8ea",
                    "on-tertiary-fixed": "#410005",
                    "on-secondary-fixed": "#0d1c2e",
                    "background": "#f7f9fb",
                    "inverse-primary": "#68dba9",
                    "on-primary-fixed-variant": "#005137",
                    "surface-container-low": "#f2f4f6",
                    "surface-container-lowest": "#ffffff",
                    "outline-variant": "#bbcabf",
                    "primary-fixed": "#85f8c4",
                    "surface-container-highest": "#e0e3e5",
                    "error": "#ba1a1a",
                    "tertiary-container": "#fc7c78",
                    "on-primary": "#ffffff",
                    "surface-container": "#eceef0",
                    "on-background": "#191c1e",
                    "inverse-on-surface": "#eff1f3",
                    "on-secondary-fixed-variant": "#3a485b",
                    "primary": "#006c4a",
                    "on-surface-variant": "#3c4a42",
                    "secondary-container": "#d5e3fc",
                    "secondary-fixed": "#d5e3fc",
                    "surface-bright": "#f7f9fb"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Manrope"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(24px);
        }
    </style>
</head>
<body class="bg-surface font-body text-on-surface">
<!-- Side Navigation Shell -->
<aside class="h-screen w-64 fixed left-0 top-0 bg-white dark:bg-slate-950 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] flex flex-col py-8 px-4 font-headline text-sm font-medium">
<div class="mb-10 px-2">
<h1 class="text-lg font-black text-emerald-800 dark:text-emerald-100">SheetFinance</h1>
<p class="text-xs text-on-surface-variant font-body">Growth &amp; Precision</p>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-transform hover:translate-x-1" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Dashboard</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-transform hover:translate-x-1" href="#">
<span class="material-symbols-outlined" data-icon="inventory_2">inventory_2</span>
<span>Four Bucket Model</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-r-4 border-emerald-600 transition-transform hover:translate-x-1" href="#">
<span class="material-symbols-outlined" data-icon="moving">moving</span>
<span>Wealth Ladder</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-transform hover:translate-x-1" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span>General Overview</span>
</a>
<a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-transform hover:translate-x-1" href="#">
<span class="material-symbols-outlined" data-icon="payments">payments</span>
<span>Monthly Spending</span>
</a>
</nav>
<div class="mt-auto space-y-1 pt-6 border-t border-surface-container">
<button class="w-full bg-emerald-600 text-white rounded-lg py-2.5 mb-4 font-semibold active:scale-95 transition-all">
                Upgrade Plan
            </button>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-emerald-600" href="#">
<span class="material-symbols-outlined" data-icon="help">help</span>
<span>Support</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-emerald-600" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="ml-64 min-h-screen">
<!-- Top Navigation Bar -->
<header class="w-full sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 shadow-sm">
<div class="flex items-center gap-4">
<div class="relative flex items-center">
<span class="material-symbols-outlined absolute left-3 text-slate-400" data-icon="search">search</span>
<input class="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary focus:bg-white transition-all" placeholder="Search wealth metrics..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-slate-100 transition-colors">
<span class="material-symbols-outlined text-slate-600" data-icon="settings">settings</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-emerald-100">
<img alt="User profile" data-alt="Close up portrait of a professional businessman with a friendly expression in a modern office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJundu0rkAZjhiV5pN5kbgPX3gg_C3qfMsfrtCm_NBDBANFHvlYc1qjIKNkD7xelz4w51LF1LOsMyz0hMNUKfrCPP1SVHYEttIszgyHBnKhmt8fOVdN_MVDfPa2IKC4Z-iT81FtkxVAUKR1R-7C_XBxPNLB30hS72dQKREXdP2StL6AXNuCAg3PPcc8NknurMSWz8BNtpQWhksgsEyVbLYTroe6MVYROwe7XMZqppKdLVmkw_7kq7AaLLD69mNJYoIruuQPmK8_SM"/>
</div>
</div>
</header>
<div class="p-12 max-w-7xl mx-auto">
<!-- Hero Section -->
<section class="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
<div class="max-w-2xl">
<h2 class="text-5xl font-black font-headline tracking-tighter text-on-surface mb-4">Wealth Ladder</h2>
<p class="text-lg text-on-surface-variant leading-relaxed">Your journey from financial security to absolute abundance. Each level represents a fundamental shift in how your capital works for you.</p>
</div>
<div class="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-emerald-600 shadow-sm flex items-center gap-6">
<div>
<p class="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">Current Milestone</p>
<p class="text-2xl font-black font-headline">Level 3: Stability</p>
</div>
<div class="h-12 w-12 rounded-full border-4 border-emerald-100 flex items-center justify-center">
<span class="text-emerald-600 font-black text-sm">68%</span>
</div>
</div>
</section>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
<!-- The Ladder Progression -->
<div class="lg:col-span-7 relative">
<div class="absolute left-6 top-0 bottom-0 w-0.5 bg-surface-container-high z-0"></div>
<div class="space-y-12 relative z-10">
<!-- Level 1 -->
<div class="flex gap-8 group">
<div class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-200">1</div>
<div class="flex-1 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-emerald-50 transition-transform hover:-translate-y-1">
<div class="flex justify-between items-start mb-2">
<h4 class="text-xl font-bold font-headline">Solvency</h4>
<span class="material-symbols-outlined text-emerald-500" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<p class="text-sm text-on-surface-variant mb-4">Earnings exceed basic expenses and debts are under control.</p>
<div class="flex items-center gap-2">
<span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-tight">Unlocked</span>
</div>
</div>
</div>
<!-- Level 2 -->
<div class="flex gap-8 group">
<div class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-200">2</div>
<div class="flex-1 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-emerald-50 transition-transform hover:-translate-y-1">
<div class="flex justify-between items-start mb-2">
<h4 class="text-xl font-bold font-headline">Stability</h4>
<span class="material-symbols-outlined text-emerald-500" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<p class="text-sm text-on-surface-variant mb-4">Emergency fund fully funded with 6 months of expenses.</p>
<div class="flex items-center gap-2">
<span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-tight">Unlocked</span>
</div>
</div>
</div>
<!-- Level 3 (Current) -->
<div class="flex gap-8 group">
<div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-black text-white relative">
                                3
                                <div class="absolute -inset-2 rounded-full border border-primary animate-pulse opacity-30"></div>
</div>
<div class="flex-1 bg-white p-8 rounded-xl shadow-xl shadow-emerald-900/5 border-2 border-emerald-600 transition-transform hover:-translate-y-1">
<div class="flex justify-between items-start mb-4">
<div>
<h4 class="text-xl font-bold font-headline text-emerald-900">Agency</h4>
<p class="text-sm text-emerald-700">Financial freedom to make life pivots.</p>
</div>
<span class="material-symbols-outlined text-emerald-600" data-icon="bolt">bolt</span>
</div>
<div class="space-y-3">
<div class="flex justify-between text-xs font-bold">
<span class="text-on-surface-variant">Progress to Level 4</span>
<span class="text-emerald-700">$12,450 / $18,000</span>
</div>
<div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-primary w-[68%] rounded-full"></div>
</div>
</div>
</div>
</div>
<!-- Level 4 (Locked) -->
<div class="flex gap-8 group opacity-60">
<div class="w-12 h-12 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-black">4</div>
<div class="flex-1 bg-surface-container-low p-8 rounded-xl border border-transparent grayscale hover:grayscale-0 transition-all cursor-not-allowed">
<div class="flex justify-between items-start mb-2">
<h4 class="text-xl font-bold font-headline">Security</h4>
<span class="material-symbols-outlined text-slate-400" data-icon="lock">lock</span>
</div>
<p class="text-sm text-on-surface-variant mb-4">Investment income covers basic life necessities forever.</p>
<div class="flex items-center gap-2">
<span class="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-tight">Locked</span>
</div>
</div>
</div>
<!-- Levels 5-7 Collapse (Simplified) -->
<div class="pl-20 py-4">
<div class="bg-surface-container p-6 rounded-xl flex items-center justify-between">
<div class="flex -space-x-2">
<div class="w-8 h-8 rounded-full bg-surface-container-high border-2 border-white flex items-center justify-center text-[10px] font-bold">5</div>
<div class="w-8 h-8 rounded-full bg-surface-container-high border-2 border-white flex items-center justify-center text-[10px] font-bold">6</div>
<div class="w-8 h-8 rounded-full bg-surface-container-high border-2 border-white flex items-center justify-center text-[10px] font-bold">7</div>
</div>
<span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Levels: Independence, Abundance, Legacy</span>
<span class="material-symbols-outlined text-slate-400" data-icon="expand_more">expand_more</span>
</div>
</div>
</div>
</div>
<!-- Insight Panel -->
<div class="lg:col-span-5 space-y-8">
<!-- Risk Profile Bento Card -->
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-sm overflow-hidden relative group">
<div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-8xl" data-icon="radar">radar</span>
</div>
<h5 class="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-6">Risk Profile</h5>
<div class="space-y-6 relative z-10">
<div>
<div class="flex justify-between mb-2">
<span class="text-sm font-medium">Portfolio Volatility</span>
<span class="text-sm font-bold">Moderate</span>
</div>
<div class="flex gap-1">
<div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
<div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
<div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
<div class="h-1.5 flex-1 bg-surface-container rounded-full"></div>
<div class="h-1.5 flex-1 bg-surface-container rounded-full"></div>
</div>
</div>
<div>
<div class="flex justify-between mb-2">
<span class="text-sm font-medium">Income Diversity</span>
<span class="text-sm font-bold">High</span>
</div>
<div class="flex gap-1">
<div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
<div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
<div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
<div class="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
<div class="h-1.5 flex-1 bg-surface-container rounded-full"></div>
</div>
</div>
</div>
<div class="mt-8 p-4 bg-surface-container-low rounded-lg">
<p class="text-xs leading-relaxed text-on-surface-variant">Your risk appetite is currently optimized for <span class="text-emerald-700 font-bold">Growth Phase</span>. We recommend maintaining a 20% liquid cash reserve at Level 3.</p>
</div>
</div>
<!-- Path Ahead Visualizer -->
<div class="bg-primary text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
<div class="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
<span class="material-symbols-outlined text-[200px]" data-icon="trending_up">trending_up</span>
</div>
<h5 class="text-sm font-bold uppercase tracking-widest text-emerald-100 mb-6">Path Ahead</h5>
<div class="mb-8">
<p class="text-4xl font-black font-headline mb-1">$450,000</p>
<p class="text-xs text-emerald-100 font-medium">Target Net Worth for Security (Level 4)</p>
</div>
<div class="space-y-4">
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-emerald-300"></div>
<span class="text-xs font-medium">Projected Timeline: 42 Months</span>
</div>
<div class="flex items-center gap-3">
<div class="w-2 h-2 rounded-full bg-emerald-300"></div>
<span class="text-xs font-medium">Yield Requirement: 7.2% APY</span>
</div>
</div>
<button class="mt-10 w-full bg-white text-emerald-900 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors active:scale-95">
                            Adjust Trajectory
                        </button>
</div>
<!-- Advisor Insight -->
<div class="p-8 rounded-xl border-2 border-dashed border-outline-variant hover:border-emerald-200 transition-colors">
<div class="flex items-start gap-4">
<span class="material-symbols-outlined text-tertiary" data-icon="lightbulb" style="font-variation-settings: 'FILL' 1;">lightbulb</span>
<div>
<h6 class="font-bold mb-1">Precision Tip</h6>
<p class="text-sm text-on-surface-variant leading-relaxed">Transitioning from Level 3 to Level 4 usually requires a shift from <span class="font-bold italic">active saving</span> to <span class="font-bold italic">passive compounding</span>. Re-evaluate your tax-advantaged accounts.</p>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Sticky Footer Branding -->
<footer class="flex flex-row justify-between items-center px-12 py-6 mt-12 bg-slate-50 border-t border-slate-200 font-inter text-xs text-slate-500">
<div class="flex items-center gap-4">
<span class="font-bold text-slate-900">SheetFinance</span>
<span class="text-slate-300">|</span>
<span>© 2024 SheetFinance. All rights reserved.</span>
</div>
<div class="flex gap-8">
<a class="text-slate-400 hover:text-emerald-600 transition-colors" href="#">Legal</a>
<a class="text-slate-400 hover:text-emerald-600 transition-colors" href="#">Privacy Policy</a>
<a class="text-slate-400 hover:text-emerald-600 transition-colors" href="#">System Status</a>
</div>
</footer>
</main>
</body></html>

<!-- Wealth Ladder (Modern) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SheetFinance - General Overview</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;family=Inter:wght@400;500;600&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed-dim": "#ffb3af",
                    "on-primary-fixed": "#002114",
                    "on-tertiary-fixed-variant": "#842225",
                    "surface": "#f7f9fb",
                    "tertiary-fixed": "#ffdad7",
                    "error-container": "#ffdad6",
                    "inverse-surface": "#2d3133",
                    "secondary": "#515f74",
                    "on-tertiary-container": "#711419",
                    "secondary-fixed-dim": "#b9c7df",
                    "on-surface": "#191c1e",
                    "outline": "#6c7a71",
                    "primary-fixed-dim": "#68dba9",
                    "tertiary": "#a43a3a",
                    "surface-tint": "#006c4a",
                    "on-secondary": "#ffffff",
                    "primary-container": "#3fb687",
                    "on-error": "#ffffff",
                    "on-error-container": "#93000a",
                    "surface-dim": "#d8dadc",
                    "on-primary-container": "#00422c",
                    "surface-variant": "#e0e3e5",
                    "on-secondary-container": "#57657a",
                    "surface-container-high": "#e6e8ea",
                    "on-tertiary-fixed": "#410005",
                    "on-secondary-fixed": "#0d1c2e",
                    "background": "#f7f9fb",
                    "inverse-primary": "#68dba9",
                    "on-primary-fixed-variant": "#005137",
                    "surface-container-low": "#f2f4f6",
                    "surface-container-lowest": "#ffffff",
                    "outline-variant": "#bbcabf",
                    "primary-fixed": "#85f8c4",
                    "surface-container-highest": "#e0e3e5",
                    "error": "#ba1a1a",
                    "tertiary-container": "#fc7c78",
                    "on-primary": "#ffffff",
                    "surface-container": "#eceef0",
                    "on-background": "#191c1e",
                    "inverse-on-surface": "#eff1f3",
                    "on-secondary-fixed-variant": "#3a485b",
                    "primary": "#006c4a",
                    "on-surface-variant": "#3c4a42",
                    "secondary-container": "#d5e3fc",
                    "secondary-fixed": "#d5e3fc",
                    "surface-bright": "#f7f9fb"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Manrope"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3 { font-family: 'Manrope', sans-serif; }
    </style>
</head>
<body class="bg-surface text-on-surface antialiased">
<!-- SideNavBar -->
<aside class="h-screen w-64 fixed left-0 top-0 bg-white dark:bg-slate-950 flex flex-col py-8 px-4 shadow-[1px_0_0_0_rgba(0,0,0,0.05)] z-40">
<div class="mb-10 px-2">
<div class="flex items-center gap-3">
<div class="w-8 h-8 bg-gradient-to-br from-primary to-primary-container rounded flex items-center justify-center">
<span class="material-symbols-outlined text-white text-xl">account_balance</span>
</div>
<div>
<h1 class="text-lg font-black text-emerald-800 tracking-tight leading-none">SheetFinance</h1>
<p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Growth &amp; Precision</p>
</div>
</div>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-3 px-3 py-2.5 font-manrope text-sm font-medium text-slate-600 hover:bg-slate-50 hover:translate-x-1 transition-all" href="#">
<span class="material-symbols-outlined text-[20px]">dashboard</span>
                Dashboard
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 font-manrope text-sm font-medium text-slate-600 hover:bg-slate-50 hover:translate-x-1 transition-all" href="#">
<span class="material-symbols-outlined text-[20px]">inventory_2</span>
                Four Bucket Model
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 font-manrope text-sm font-medium text-slate-600 hover:bg-slate-50 hover:translate-x-1 transition-all" href="#">
<span class="material-symbols-outlined text-[20px]">moving</span>
                Wealth Ladder
            </a>
<!-- Active State: General Overview -->
<a class="flex items-center gap-3 px-3 py-2.5 font-manrope text-sm font-medium bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600 hover:translate-x-1 transition-all" href="#">
<span class="material-symbols-outlined text-[20px]">analytics</span>
                General Overview
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 font-manrope text-sm font-medium text-slate-600 hover:bg-slate-50 hover:translate-x-1 transition-all" href="#">
<span class="material-symbols-outlined text-[20px]">payments</span>
                Monthly Spending
            </a>
</nav>
<div class="mt-auto pt-8 border-t border-slate-100">
<div class="bg-surface-container-low p-4 rounded-xl mb-4">
<p class="text-xs font-semibold text-slate-700 mb-2">Portfolio Protection</p>
<div class="w-full bg-slate-200 h-1.5 rounded-full mb-2">
<div class="bg-primary h-1.5 rounded-full" style="width: 75%"></div>
</div>
<button class="w-full text-xs font-bold text-primary hover:underline flex items-center justify-between">
                    Upgrade Plan
                    <span class="material-symbols-outlined text-xs">arrow_forward</span>
</button>
</div>
<a class="flex items-center gap-3 px-3 py-2 font-manrope text-sm font-medium text-slate-600 hover:bg-slate-50 hover:translate-x-1 transition-all" href="#">
<span class="material-symbols-outlined text-[20px]">help</span>
                Support
            </a>
<a class="flex items-center gap-3 px-3 py-2 font-manrope text-sm font-medium text-slate-600 hover:bg-slate-50 hover:translate-x-1 transition-all" href="#">
<span class="material-symbols-outlined text-[20px]">settings</span>
                Settings
            </a>
</div>
</aside>
<!-- TopNavBar -->
<header class="w-full sticky top-0 z-30 flex justify-between items-center px-6 h-16 bg-slate-50/80 backdrop-blur-xl ml-64 max-w-[calc(100%-16rem)]">
<div class="flex items-center bg-slate-100 rounded-full px-4 py-2 w-96">
<span class="material-symbols-outlined text-slate-400 text-lg">search</span>
<input class="bg-transparent border-none focus:ring-0 text-sm text-on-surface-variant w-full placeholder-slate-400" placeholder="Search analytics..." type="text"/>
</div>
<div class="flex items-center gap-6">
<button class="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full border-2 border-slate-50"></span>
</button>
<div class="flex items-center gap-3 group cursor-pointer">
<div class="text-right">
<p class="text-sm font-bold text-on-surface leading-tight">Alexander Sterling</p>
<p class="text-[10px] text-slate-500 font-medium">Private Banking Tier</p>
</div>
<img alt="User profile" class="w-10 h-10 rounded-lg object-cover ring-2 ring-offset-2 ring-slate-100 group-hover:ring-primary-container transition-all" data-alt="Close-up portrait of a professional man with a clean beard wearing a crisp white shirt against a soft office background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADFeoIFcN5Wafx0z-pxHqDhNJZTTqXG0WfcaysnMxx2yA7-plpkSCSM9_4a086lYmKRSs_Vwg9ruSQ2fJICk5aMs0WhwgOVd_ZT0S8TA_5vcFrdctz5JqX8-Mw96gy0VHU4xObNW4YSrZKUDBvzxR37QBY05PdbP0bDcwzzeWj7TT57qZDnbhsMaXPfC8X13vfBLPlqxzFQaVuL25Dd6G-18iYfkzsRuqlLH01EFSbQfv_zyT65ISz66bt1zyV_Q3OWJcSjfanV7s"/>
</div>
</div>
</header>
<!-- Main Content -->
<main class="ml-64 p-8 min-h-screen">
<!-- Header Section -->
<div class="flex justify-between items-end mb-10">
<div>
<nav class="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3 tracking-wider uppercase">
<span>Analysis</span>
<span class="material-symbols-outlined text-xs">chevron_right</span>
<span class="text-primary">General Overview</span>
</nav>
<h2 class="text-4xl font-extrabold text-on-surface tracking-tighter">Financial Vitality</h2>
<p class="text-on-surface-variant mt-2 max-w-md">Precision reporting on your current solvency, liquidity ratios, and total capital distribution.</p>
</div>
<div class="flex gap-3">
<button class="bg-white px-5 py-2.5 rounded-lg text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-lg">download</span>
                    Export Ledger
                </button>
<button class="bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 rounded-lg text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
<span class="material-symbols-outlined text-lg">add</span>
                    New Asset
                </button>
</div>
</div>
<!-- Bento Grid Metrics -->
<div class="grid grid-cols-12 gap-6 mb-8">
<!-- Net Worth Card -->
<div class="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
<div class="absolute -right-12 -top-12 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
<div class="relative z-10 flex justify-between">
<div>
<p class="text-slate-500 font-medium text-sm mb-1">Total Net Worth</p>
<h3 class="text-6xl font-black text-on-surface tracking-tighter">$2,482,900<span class="text-2xl text-primary font-bold ml-2">.42</span></h3>
<div class="flex items-center gap-2 mt-4 text-primary font-bold text-sm">
<span class="material-symbols-outlined text-sm">trending_up</span>
                            +12.4% vs last quarter
                        </div>
</div>
<div class="text-right">
<div class="bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-widest inline-block">Top 2% Globally</div>
</div>
</div>
<div class="mt-12 h-32 w-full flex items-end gap-1">
<div class="flex-1 bg-emerald-50 rounded-t h-1/4"></div>
<div class="flex-1 bg-emerald-50 rounded-t h-1/3"></div>
<div class="flex-1 bg-emerald-100 rounded-t h-1/2"></div>
<div class="flex-1 bg-emerald-100 rounded-t h-2/5"></div>
<div class="flex-1 bg-emerald-200 rounded-t h-3/5"></div>
<div class="flex-1 bg-emerald-200 rounded-t h-4/5"></div>
<div class="flex-1 bg-primary-container rounded-t h-3/4"></div>
<div class="flex-1 bg-primary-container rounded-t h-full"></div>
<div class="flex-1 bg-primary rounded-t h-5/6"></div>
<div class="flex-1 bg-primary rounded-t h-4/6"></div>
</div>
</div>
<!-- Liquidity Ratio -->
<div class="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-center items-center text-center">
<div class="w-32 h-32 rounded-full border-8 border-slate-200 flex items-center justify-center relative">
<svg class="absolute inset-0 transform -rotate-90">
<circle class="text-primary" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" stroke-dasharray="351.85" stroke-dashoffset="105.5" stroke-width="8"></circle>
</svg>
<div class="text-center">
<span class="text-3xl font-black text-on-surface">2.4</span>
<p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Healthy</p>
</div>
</div>
<h4 class="mt-6 text-xl font-extrabold text-on-surface tracking-tight">Liquidity Ratio</h4>
<p class="text-xs text-on-surface-variant mt-2 px-4">You can cover short-term liabilities 2.4x over with available cash assets.</p>
</div>
</div>
<!-- Secondary Metrics Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Solvency Score -->
<div class="bg-surface-container-lowest p-6 rounded-xl relative">
<div class="flex items-start justify-between mb-8">
<div>
<p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Solvency Score</p>
<h4 class="text-2xl font-black text-on-surface tracking-tight">842 / 1000</h4>
</div>
<div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined">security</span>
</div>
</div>
<div class="w-full bg-slate-100 h-1 rounded-full">
<div class="bg-blue-500 h-1 rounded-full" style="width: 84.2%"></div>
</div>
<p class="text-[11px] text-slate-500 mt-4 leading-relaxed">
                    Based on your long-term debt-to-income stability and asset diversity. 
                    <a class="text-primary font-bold hover:underline" href="#">View details</a>
</p>
</div>
<!-- Working Capital -->
<div class="bg-surface-container-lowest p-6 rounded-xl relative">
<div class="flex items-start justify-between mb-8">
<div>
<p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Working Capital</p>
<h4 class="text-2xl font-black text-on-surface tracking-tight">$314,200</h4>
</div>
<div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined">account_balance_wallet</span>
</div>
</div>
<div class="flex items-center gap-1">
<span class="text-xs font-bold text-emerald-600">+$12,400</span>
<span class="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Monthly Delta</span>
</div>
<div class="mt-4 flex gap-1 h-8 items-end">
<div class="flex-1 bg-slate-50 h-2 rounded-sm"></div>
<div class="flex-1 bg-slate-50 h-3 rounded-sm"></div>
<div class="flex-1 bg-slate-50 h-5 rounded-sm"></div>
<div class="flex-1 bg-emerald-100 h-8 rounded-sm"></div>
<div class="flex-1 bg-slate-50 h-4 rounded-sm"></div>
</div>
</div>
<!-- Debt to Equity -->
<div class="bg-surface-container-low p-6 rounded-xl border border-white/50">
<p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Debt-to-Equity</p>
<div class="flex h-4 w-full rounded-full overflow-hidden mb-4">
<div class="h-full bg-primary" style="width: 25%"></div>
<div class="h-full bg-slate-200" style="width: 75%"></div>
</div>
<div class="flex justify-between items-center">
<div>
<p class="text-[10px] text-slate-400 font-bold uppercase">Debt</p>
<p class="text-sm font-bold text-on-surface">25.0%</p>
</div>
<div class="text-right">
<p class="text-[10px] text-slate-400 font-bold uppercase">Equity</p>
<p class="text-sm font-bold text-on-surface">75.0%</p>
</div>
</div>
<p class="text-[10px] italic text-slate-500 mt-6 text-center">Highly optimized leverage structure</p>
</div>
</div>
<!-- Professional Context Section -->
<div class="mt-12 grid grid-cols-12 gap-8 items-start">
<div class="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
<h4 class="text-lg font-bold text-on-surface mb-6">Strategic Outlook</h4>
<div class="space-y-6">
<div class="flex gap-4">
<div class="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-sm">rocket_launch</span>
</div>
<div>
<p class="text-sm font-bold text-on-surface">Accelerated Growth</p>
<p class="text-xs text-slate-500 mt-1">Market conditions favor your currently allocated tech portfolio. Hold position for 18-24 months.</p>
</div>
</div>
<div class="flex gap-4">
<div class="w-8 h-8 rounded-full bg-tertiary/10 flex-shrink-0 flex items-center justify-center">
<span class="material-symbols-outlined text-tertiary text-sm">warning</span>
</div>
<div>
<p class="text-sm font-bold text-on-surface">Risk Mitigation</p>
<p class="text-xs text-slate-500 mt-1">Real estate liquidity is currently below historical average. Consider rebalancing into REITs.</p>
</div>
</div>
<div class="flex gap-4">
<div class="w-8 h-8 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center">
<span class="material-symbols-outlined text-blue-600 text-sm">history_edu</span>
</div>
<div>
<p class="text-sm font-bold text-on-surface">Tax Optimization</p>
<p class="text-xs text-slate-500 mt-1">Year-end harvesting strategies could reduce liability by approximately $14,000.</p>
</div>
</div>
</div>
</div>
<div class="col-span-12 lg:col-span-8">
<div class="bg-surface-container-high rounded-xl overflow-hidden relative min-h-[300px]">
<img alt="Financial Market Concept" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" data-alt="Abstract cinematic visualization of global financial markets with glowing green data streams and glowing structural lines on dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0J3xGtln5uGJKzmLflZTPIQFzJWSb95LgqykOJ2EVxTMNOD7RI846lEK0eUcUCxK9txYYe9AICN7ODeeHDOLyobbkpvcJnLa8cAZd7UB_wDveLLUrb7eAOoS7pOjV-xNwh7PnJYOgOAG3NlzSd3OXPC06dpjtSRataTveFY9_LW3wRmZWrzcptiN_0SduhRvEOizic1lxTrn5En1OvgGCCuxwARv9PXyr5FNyKrnlYdwpV8VM3IB3sg5AKGnYPbte2z6htVZ7rfc"/>
<div class="relative z-10 p-10 h-full flex flex-col justify-end bg-gradient-to-t from-emerald-900/80 to-transparent">
<p class="text-xs font-black text-emerald-300 uppercase tracking-widest mb-2">Market Sentiment Analysis</p>
<h3 class="text-3xl font-black text-white leading-tight max-w-xl">Precision Wealth Management requires more than just numbers. It requires perspective.</h3>
<button class="mt-6 self-start px-6 py-2 bg-white text-emerald-900 font-bold rounded-lg text-sm hover:bg-emerald-50 transition-colors">
                            Request Advisory Call
                        </button>
</div>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="ml-64 border-t border-slate-200 bg-slate-50 px-12 py-6 flex flex-row justify-between items-center">
<div class="flex items-center gap-8">
<p class="font-inter text-xs text-slate-500">© 2024 SheetFinance. All rights reserved.</p>
<div class="flex gap-6">
<a class="font-inter text-xs text-slate-400 hover:text-emerald-500 transition-colors" href="#">Legal</a>
<a class="font-inter text-xs text-slate-400 hover:text-emerald-500 transition-colors" href="#">Privacy Policy</a>
<a class="font-inter text-xs text-slate-400 hover:text-emerald-500 transition-colors" href="#">System Status</a>
</div>
</div>
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span class="font-inter text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Engine Active</span>
</div>
</footer>
</body></html>

<!-- General Overview (Modern) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Login | SheetFinance</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed-dim": "#ffb3af",
                    "on-primary-fixed": "#002114",
                    "on-tertiary-fixed-variant": "#842225",
                    "surface": "#f7f9fb",
                    "tertiary-fixed": "#ffdad7",
                    "error-container": "#ffdad6",
                    "inverse-surface": "#2d3133",
                    "secondary": "#515f74",
                    "on-tertiary-container": "#711419",
                    "secondary-fixed-dim": "#b9c7df",
                    "on-surface": "#191c1e",
                    "outline": "#6c7a71",
                    "primary-fixed-dim": "#68dba9",
                    "tertiary": "#a43a3a",
                    "surface-tint": "#006c4a",
                    "on-secondary": "#ffffff",
                    "primary-container": "#3fb687",
                    "on-error": "#ffffff",
                    "on-error-container": "#93000a",
                    "surface-dim": "#d8dadc",
                    "on-primary-container": "#00422c",
                    "surface-variant": "#e0e3e5",
                    "on-secondary-container": "#57657a",
                    "surface-container-high": "#e6e8ea",
                    "on-tertiary-fixed": "#410005",
                    "on-secondary-fixed": "#0d1c2e",
                    "background": "#f7f9fb",
                    "inverse-primary": "#68dba9",
                    "on-primary-fixed-variant": "#005137",
                    "surface-container-low": "#f2f4f6",
                    "surface-container-lowest": "#ffffff",
                    "outline-variant": "#bbcabf",
                    "primary-fixed": "#85f8c4",
                    "surface-container-highest": "#e0e3e5",
                    "error": "#ba1a1a",
                    "tertiary-container": "#fc7c78",
                    "on-primary": "#ffffff",
                    "surface-container": "#eceef0",
                    "on-background": "#191c1e",
                    "inverse-on-surface": "#eff1f3",
                    "on-secondary-fixed-variant": "#3a485b",
                    "primary": "#006c4a",
                    "on-surface-variant": "#3c4a42",
                    "secondary-container": "#d5e3fc",
                    "secondary-fixed": "#d5e3fc",
                    "surface-bright": "#f7f9fb"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Manrope"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .emerald-pulse-gradient {
            background: linear-gradient(135deg, #006c4a 0%, #3fb687 100%);
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(24px);
        }
    </style>
</head>
<body class="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
<!-- Background Texture Elements -->
<div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
<div class="absolute -top-[10%] -left-[5%] w-[40%] h-[60%] rounded-full bg-primary-fixed/10 blur-[120px]"></div>
<div class="absolute -bottom-[10%] -right-[5%] w-[35%] h-[50%] rounded-full bg-secondary-fixed/20 blur-[100px]"></div>
<!-- Subtle Pattern Overlay -->
<div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(#006c4a 0.5px, transparent 0.5px); background-size: 24px 24px;"></div>
</div>
<!-- Main Content Canvas -->
<main class="w-full max-w-[480px] z-10">
<!-- Brand Anchor -->
<div class="flex flex-col items-center mb-10">
<div class="w-14 h-14 rounded-xl emerald-pulse-gradient flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
<span class="material-symbols-outlined text-on-primary text-3xl" data-icon="inventory_2">inventory_2</span>
</div>
<h1 class="font-headline text-3xl font-extrabold tracking-tighter text-on-surface mb-1">SheetFinance</h1>
<p class="font-label text-sm text-on-surface-variant font-medium tracking-wide">Growth &amp; Precision</p>
</div>
<!-- Login Card -->
<div class="surface-container-lowest glass-panel rounded-xl shadow-[0_4px_20px_rgba(25,28,30,0.04),0_12px_40px_rgba(25,28,30,0.06)] overflow-hidden">
<div class="p-8 md:p-10">
<div class="mb-8">
<h2 class="font-headline text-xl font-bold text-on-surface mb-2">Welcome Back</h2>
<p class="text-on-surface-variant text-sm">Access your financial conservatory.</p>
</div>
<form class="space-y-6">
<!-- Input: Email -->
<div class="space-y-2">
<label class="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1" for="email">Work Email</label>
<div class="relative group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors" data-icon="alternate_email">alternate_email</span>
</div>
<input class="w-full h-12 pl-11 pr-4 bg-surface-container-low border-none rounded-lg focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[0_0_0_1px_rgba(0,108,74,0.15)] transition-all placeholder:text-outline/50 text-sm" id="email" placeholder="name@company.com" type="email"/>
</div>
</div>
<!-- Input: Password -->
<div class="space-y-2">
<div class="flex justify-between items-center px-1">
<label class="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant" for="password">Password</label>
<a class="text-xs font-medium text-primary hover:text-primary-container transition-colors" href="#">Forgot?</a>
</div>
<div class="relative group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors" data-icon="lock">lock</span>
</div>
<input class="w-full h-12 pl-11 pr-4 bg-surface-container-low border-none rounded-lg focus:ring-0 focus:bg-surface-container-lowest focus:shadow-[0_0_0_1px_rgba(0,108,74,0.15)] transition-all placeholder:text-outline/50 text-sm" id="password" placeholder="••••••••" type="password"/>
</div>
</div>
<!-- Actions -->
<div class="pt-2">
<button class="w-full h-12 emerald-pulse-gradient text-on-primary font-bold rounded-lg shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
<span>Sign In</span>
<span class="material-symbols-outlined text-xl" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
<div class="relative flex items-center py-2">
<div class="flex-grow border-t border-outline-variant/10"></div>
<span class="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-outline">Social Sync</span>
<div class="flex-grow border-t border-outline-variant/10"></div>
</div>
<!-- Sync Google Sheets Button -->
<button class="w-full h-12 bg-white border border-outline-variant/20 hover:border-outline-variant/50 hover:bg-surface-container-low text-on-surface text-sm font-semibold rounded-lg flex items-center justify-center gap-3 transition-all" type="button">
<svg class="w-5 h-5" viewbox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
</svg>
<span>Sync with Google Sheets</span>
</button>
</form>
</div>
<!-- Footer Action -->
<div class="bg-surface-container-low/50 py-5 px-8 md:px-10 text-center border-t border-outline-variant/10">
<p class="text-xs text-on-surface-variant">
                    New to the Conservatory? <a class="font-bold text-primary hover:underline" href="#">Create an account</a>
</p>
</div>
</div>
<!-- Security Badge -->
<div class="mt-8 flex items-center justify-center gap-6 opacity-40">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-lg" data-icon="verified_user">verified_user</span>
<span class="text-[10px] font-bold uppercase tracking-widest">Bank-grade Security</span>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-lg" data-icon="lock_clock">lock_clock</span>
<span class="text-[10px] font-bold uppercase tracking-widest">256-bit AES</span>
</div>
</div>
</main>
<!-- Global Footer from Shared Components -->
<footer class="w-full py-6 mt-auto flex flex-row justify-between items-center px-12 border-t border-slate-200 dark:border-slate-800 z-10">
<div class="font-inter text-xs text-slate-500 dark:text-slate-400">© 2024 SheetFinance. All rights reserved.</div>
<div class="flex gap-6">
<a class="font-inter text-xs text-slate-400 hover:text-emerald-500 transition-colors" href="#">Legal</a>
<a class="font-inter text-xs text-slate-400 hover:text-emerald-500 transition-colors" href="#">Privacy Policy</a>
<a class="font-inter text-xs text-slate-400 hover:text-emerald-500 transition-colors" href="#">System Status</a>
</div>
</footer>
<!-- Decorative Aesthetic Image -->
<div class="fixed top-0 right-0 w-[500px] h-full pointer-events-none hidden xl:block opacity-50">
<img class="w-full h-full object-cover mix-blend-multiply grayscale-[20%]" data-alt="Abstract artistic visualization of wealth growth using translucent emerald glass shapes and soft architectural shadows in a sunlit atrium" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsLt0DWDW23VBA4hFv5gtr_oSotf9Hop1CA06YeDACchSCkhEwK44aEZOA9XruZoMmiUuvAg3wtjWpRzHQVa8pM85tXCGrJ48247HtFaRBYeNc9h3JGLO2G0myu-FK3c5zlA0KUA6Z9sH1MXDng603SSEWdofckN3lXXd9gYWvi9BZRYhWhzBmus2ZEkfGM2-yK6GmZfZdAfmcFElAV0KcSH7smeL2DKdmZ00nD8FWLiL_pvif63LVKalzQVspH2T1-lfh9LeCw68"/>
</div>
</body></html>