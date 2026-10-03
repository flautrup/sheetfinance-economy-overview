const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const RESULTS_DIR = path.join(__dirname, "perf_results");
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const CHROME_PATH = process.env.CHROME_BIN || "/home/fredrik/.local/bin/google-chrome";
const ITERATIONS = 7; // warm iterations for statistical validity
const CONCURRENCY = 10; // concurrent requests for stress profiling

// Statistical helper functions
function stats(arr) {
  if (arr.length === 0) return { min: 0, max: 0, mean: 0, median: 0, p95: 0 };
  const sorted = [...arr].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / sorted.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || max;
  return {
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    mean: Math.round(mean * 10) / 10,
    median: Math.round(median * 10) / 10,
    p95: Math.round(p95 * 10) / 10,
  };
}

async function runPerformanceTestSuite() {
  console.log("=================================================================");
  console.log("⚡ BALANS COMPREHENSIVE PERFORMANCE BENCHMARK & TEST SUITE");
  console.log("=================================================================");
  console.log(`Target Host: ${BASE_URL}`);
  console.log(`Chrome Binary: ${CHROME_PATH}`);
  console.log(`Benchmarking iterations: ${ITERATIONS} | Concurrency: ${CONCURRENCY}\n`);

  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      targetUrl: BASE_URL,
      nodeVersion: process.version,
    },
    databaseBenchmarks: {},
    apiBenchmarks: [],
    concurrencyBenchmarks: [],
    browserWebVitals: [],
    diagnostics: [],
    actionableRecommendations: []
  };

  // -----------------------------------------------------------------
  // 1. DATABASE & SQLITE PRAGMA PROFILING
  // -----------------------------------------------------------------
  console.log("🔍 [1/4] Profiling Database Layer & SQLite Configuration...");
  const prisma = new PrismaClient();
  try {
    const dbPath = path.resolve(__dirname, "../prisma/dev.db");
    let dbFileSizeMb = 0;
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      dbFileSizeMb = Math.round((stats.size / (1024 * 1024)) * 100) / 100;
    }

    const journalMode = await prisma.$queryRawUnsafe("PRAGMA journal_mode;");
    const synchronous = await prisma.$queryRawUnsafe("PRAGMA synchronous;");
    const cacheSize = await prisma.$queryRawUnsafe("PRAGMA cache_size;");
    const pageSize = await prisma.$queryRawUnsafe("PRAGMA page_size;");

    // Benchmark fundamental queries
    const t0 = performance.now();
    const totalTransactions = await prisma.transaction.count();
    const countLatency = performance.now() - t0;

    const t1 = performance.now();
    const unindexedSearchCount = await prisma.$queryRawUnsafe(
      "SELECT count(*) as cnt FROM \"Transaction\" WHERE description LIKE '%ICA%'"
    );
    const searchLatency = performance.now() - t1;

    const t2 = performance.now();
    const aggregationResult = await prisma.$queryRawUnsafe(
      "SELECT area, sum(amount) as total FROM \"Transaction\" GROUP BY area"
    );
    const aggregationLatency = performance.now() - t2;

    const t3 = performance.now();
    const indexedDateLookup = await prisma.$queryRawUnsafe(
      "SELECT count(*) as cnt FROM \"Transaction\" WHERE date >= '2024-01-01' AND date <= '2024-12-31'"
    );
    const dateQueryLatency = performance.now() - t3;

    report.databaseBenchmarks = {
      dbFileSizeMb,
      totalTransactions,
      pragmas: {
        journal_mode: journalMode[0]?.journal_mode || "unknown",
        synchronous: synchronous[0]?.synchronous ?? "unknown",
        cache_size: cacheSize[0]?.cache_size ?? "unknown",
        page_size: pageSize[0]?.page_size ?? "unknown",
      },
      queryLatenciesMs: {
        fullTableCount: Math.round(countLatency * 100) / 100,
        unindexedTextSearchIca: Math.round(searchLatency * 100) / 100,
        nativeGroupByAggregation: Math.round(aggregationLatency * 100) / 100,
        indexedDateRangeLookup: Math.round(dateQueryLatency * 100) / 100,
      }
    };

    console.log(`   Database Size: ${dbFileSizeMb} MB (${totalTransactions.toLocaleString()} transactions)`);
    console.log(`   SQLite Journal Mode: ${report.databaseBenchmarks.pragmas.journal_mode.toUpperCase()}`);
    console.log(`   Full Table Count: ${report.databaseBenchmarks.queryLatenciesMs.fullTableCount} ms`);
    console.log(`   Unindexed Text Search: ${report.databaseBenchmarks.queryLatenciesMs.unindexedTextSearchIca} ms`);
    console.log(`   Native GroupBy Aggregation: ${report.databaseBenchmarks.queryLatenciesMs.nativeGroupByAggregation} ms`);
    console.log(`   Indexed Date Range Query: ${report.databaseBenchmarks.queryLatenciesMs.indexedDateRangeLookup} ms`);

  } catch (err) {
    console.error("   ❌ Database profiling error:", err.message);
  } finally {
    await prisma.$disconnect();
  }

  // -----------------------------------------------------------------
  // 2. SETUP AUTHENTICATED HEADLESS SESSION FOR API BENCHMARKING
  // -----------------------------------------------------------------
  console.log("\n🔑 [2/4] Initializing Authenticated Test Session...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--window-size=1400,900"]
  });

  const authPage = await browser.newPage();
  await authPage.goto(`${BASE_URL}/api/auth/signin`);
  const devLoginBtn = await authPage.waitForSelector('form[action*="dev-login"] button[type="submit"]', { timeout: 6000 });
  await Promise.all([
    authPage.waitForNavigation({ waitUntil: "networkidle2" }),
    devLoginBtn.click()
  ]);

  const cookies = await authPage.cookies();
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");
  console.log("   Authenticated successfully. Session cookie acquired.");

  // -----------------------------------------------------------------
  // 3. API ENDPOINTS LATENCY & THROUGHPUT BENCHMARKING
  // -----------------------------------------------------------------
  console.log("\n🚀 [3/4] Benchmarking Core API Endpoints (Latency, Payload Size, p50, p95)...");

  const endpointsToTest = [
    { name: "Dashboard Overview", path: "/api/dashboard" },
    { name: "Transactions Default (Page 1, 50 rows)", path: "/api/transactions?page=1&pageSize=50" },
    { name: "Transactions Text Search (ICA)", path: "/api/transactions?search=ICA&page=1&pageSize=50" },
    { name: "Transactions Filtered (Utgift/Mat & dryck)", path: "/api/transactions?area=Utgift&type=Mat+%26+dryck&page=1&pageSize=50" },
    { name: "Transactions Deep Pagination (Page 100)", path: "/api/transactions?page=100&pageSize=50" },
    { name: "Spending Analysis (Rolling 12M)", path: "/api/spending" },
    { name: "Spending Filtered (Year 2024)", path: "/api/spending?year=2024" },
    { name: "Wealth Ladder Calculation", path: "/api/wealth-ladder" },
    { name: "Active Merchant Rules (75 rules)", path: "/api/buckets/rules" },
    { name: "Category Taxonomy Schema", path: "/api/buckets/taxonomy" },
    { name: "Settings & DB Stats", path: "/api/reset" },
  ];

  for (const ep of endpointsToTest) {
    const latencies = [];
    let payloadSizeKb = 0;
    let status = 0;

    // Warm-up call
    try {
      await fetch(`${BASE_URL}${ep.path}`, { headers: { Cookie: cookieHeader } });
    } catch (e) {}

    // Measured iterations
    for (let i = 0; i < ITERATIONS; i++) {
      const start = performance.now();
      try {
        const res = await fetch(`${BASE_URL}${ep.path}`, {
          headers: { Cookie: cookieHeader }
        });
        status = res.status;
        const text = await res.text();
        const duration = performance.now() - start;
        latencies.push(duration);
        payloadSizeKb = Math.round((Buffer.byteLength(text, "utf8") / 1024) * 10) / 10;
      } catch (err) {
        latencies.push(performance.now() - start);
      }
    }

    const s = stats(latencies);
    const benchmarkResult = {
      endpoint: ep.name,
      path: ep.path,
      statusCode: status,
      payloadSizeKb,
      latency: s
    };
    report.apiBenchmarks.push(benchmarkResult);

    const speedEmoji = s.p95 < 100 ? "🟢" : s.p95 < 300 ? "🟡" : "🔴";
    console.log(`   ${speedEmoji} ${ep.name.padEnd(46)} | p50: ${String(s.median + 'ms').padStart(7)} | p95: ${String(s.p95 + 'ms').padStart(7)} | size: ${String(payloadSizeKb + ' KB').padStart(8)}`);
  }

  // -----------------------------------------------------------------
  // CONCURRENCY STRESS PROFILING
  // -----------------------------------------------------------------
  console.log(`\n⚡ Testing Concurrency & DB Lock Contention (${CONCURRENCY} parallel requests)...`);
  const concurrencyTargets = [
    { name: "Dashboard Concurrent Requests", path: "/api/dashboard" },
    { name: "Transactions Concurrent Search", path: "/api/transactions?search=ICA" },
    { name: "Spending Concurrent Aggregation", path: "/api/spending" }
  ];

  for (const ct of concurrencyTargets) {
    const start = performance.now();
    const promises = Array.from({ length: CONCURRENCY }).map(() =>
      fetch(`${BASE_URL}${ct.path}`, { headers: { Cookie: cookieHeader } }).then(r => r.text())
    );
    await Promise.all(promises);
    const totalTime = performance.now() - start;
    const avgPerReq = totalTime / CONCURRENCY;
    const rps = Math.round((CONCURRENCY / (totalTime / 1000)) * 10) / 10;

    report.concurrencyBenchmarks.push({
      target: ct.name,
      concurrency: CONCURRENCY,
      totalTimeMs: Math.round(totalTime * 10) / 10,
      effectiveRps: rps,
      averageLatencyMs: Math.round(avgPerReq * 10) / 10
    });

    console.log(`   🔥 ${ct.name.padEnd(36)} | Total: ${Math.round(totalTime)}ms | Throughput: ${rps} req/sec | Avg: ${Math.round(avgPerReq)}ms`);
  }

  // -----------------------------------------------------------------
  // 4. BROWSER PERFORMANCE & CORE WEB VITALS PROFILING
  // -----------------------------------------------------------------
  console.log("\n🖥️  [4/4] Measuring Client-Side Performance & Web Vitals in Headless Chrome...");

  const pagesToProfile = [
    { name: "Dashboard Overview", url: `${BASE_URL}/` },
    { name: "Transactions Ledger Table", url: `${BASE_URL}/transactions` },
    { name: "Buckets & Rules Simulator", url: `${BASE_URL}/buckets/mapping` },
    { name: "Datahantering & Ingestion", url: `${BASE_URL}/upload` },
    { name: "Kassaflöde (Spending)", url: `${BASE_URL}/spending` },
    { name: "Wealth Ladder", url: `${BASE_URL}/wealth-ladder` },
    { name: "Settings & Administration", url: `${BASE_URL}/settings` },
  ];

  for (const pg of pagesToProfile) {
    const clientPage = await browser.newPage();
    await clientPage.setViewport({ width: 1440, height: 900 });

    // Enable performance tracking
    await clientPage.evaluateOnNewDocument(() => {
      window.__webVitals = { fcp: null, lcp: null };
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            window.__webVitals.fcp = entry.startTime;
          }
        }
      }).observe({ type: "paint", buffered: true });

      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          window.__webVitals.lcp = entries[entries.length - 1].startTime;
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });

    let networkBytes = 0;
    let requestCount = 0;
    clientPage.on("response", async (res) => {
      requestCount++;
      try {
        const buf = await res.buffer();
        networkBytes += buf.length;
      } catch (e) {}
    });

    const navStart = performance.now();
    await clientPage.goto(pg.url, { waitUntil: "networkidle2" });
    const loadTimeMs = performance.now() - navStart;
    await new Promise(r => setTimeout(r, 1200)); // Allow hydration & observers to complete

    const vitals = await clientPage.evaluate(() => {
      const navTiming = performance.getEntriesByType("navigation")[0];
      const domNodes = document.querySelectorAll("*").length;
      const mem = performance.memory ? {
        usedJsHeapMb: Math.round((performance.memory.usedJSHeapSize / (1024 * 1024)) * 10) / 10,
        totalJsHeapMb: Math.round((performance.memory.totalJSHeapSize / (1024 * 1024)) * 10) / 10
      } : { usedJsHeapMb: 0, totalJsHeapMb: 0 };

      return {
        ttfb: navTiming ? Math.round(navTiming.responseStart - navTiming.requestStart) : 0,
        domInteractive: navTiming ? Math.round(navTiming.domInteractive) : 0,
        domContentLoaded: navTiming ? Math.round(navTiming.domContentLoadedEventEnd) : 0,
        fcp: window.__webVitals.fcp ? Math.round(window.__webVitals.fcp) : null,
        lcp: window.__webVitals.lcp ? Math.round(window.__webVitals.lcp) : null,
        domNodes,
        memory: mem
      };
    });

    const webVitalsData = {
      page: pg.name,
      url: pg.url,
      ttfbMs: vitals.ttfb,
      fcpMs: vitals.fcp,
      lcpMs: vitals.lcp,
      domContentLoadedMs: vitals.domContentLoaded,
      fullLoadTimeMs: Math.round(loadTimeMs),
      domNodesCount: vitals.domNodes,
      usedJsHeapMb: vitals.memory.usedJsHeapMb,
      networkRequests: requestCount,
      totalTransferredKb: Math.round(networkBytes / 1024)
    };

    report.browserWebVitals.push(webVitalsData);
    await clientPage.close();

    const lcpDisplay = webVitalsData.lcpMs ? `${webVitalsData.lcpMs}ms` : "N/A";
    console.log(`   📊 ${pg.name.padEnd(30)} | TTFB: ${String(webVitalsData.ttfbMs + 'ms').padStart(6)} | FCP: ${String(webVitalsData.fcpMs + 'ms').padStart(6)} | LCP: ${String(lcpDisplay).padStart(6)} | DOM: ${String(webVitalsData.domNodesCount).padStart(5)} nodes | JS Heap: ${webVitalsData.usedJsHeapMb}MB`);
  }

  await browser.close();

  // -----------------------------------------------------------------
  // 5. BOTTLENECK ANALYSIS & ACTIONABLE RECOMMENDATIONS
  // -----------------------------------------------------------------
  console.log("\n=================================================================");
  console.log("🔍 BOTTLENECK DIAGNOSTICS & SYSTEM AUDIT");
  console.log("=================================================================");

  // Diagnostic 1: SQLite Journal Mode
  if (report.databaseBenchmarks.pragmas?.journal_mode === "delete") {
    report.diagnostics.push({
      severity: "CRITICAL",
      component: "Database Engine (SQLite)",
      title: "SQLite Running in DELETE Journal Mode",
      description: "SQLite default journal_mode is 'delete', which locks the whole database on every write and causes synchronous disk overhead. Concurrent reads during sync or batch operations will block or fail.",
      recommendation: "Enable Write-Ahead Logging (WAL) and increase cache size: `PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA cache_size = -64000;`",
      estimatedImpact: "3x - 5x higher concurrency throughput, eliminating write-read lock stalls."
    });
  }

  // Diagnostic 2: Dashboard N+1 Query Loop
  const dashEp = report.apiBenchmarks.find(b => b.path === "/api/dashboard");
  if (dashEp && dashEp.latency.p95 > 50) {
    report.diagnostics.push({
      severity: "HIGH",
      component: "API: /api/dashboard",
      title: "N+1 Sequential Query Loop for Historical Snapshots",
      description: `Dashboard latency p95 is ${dashEp.latency.p95}ms. In src/app/api/dashboard/route.ts, for every unique historical balance date, two independent database queries (findMany and 6-month aggregate) are executed sequentially in a for loop.`,
      recommendation: "Batch fetch all historical balances in one query with `where: { date: { in: uniqueDates } }` and precalculate trailing expenses in a single grouped database aggregation.",
      estimatedImpact: "60% - 80% reduction in /api/dashboard response time."
    });
  }

  // Diagnostic 3: Spending Loading All 28k Dates
  const spendingEp = report.apiBenchmarks.find(b => b.path === "/api/spending");
  if (spendingEp) {
    report.diagnostics.push({
      severity: "HIGH",
      component: "API: /api/spending",
      title: "Full Date Ingestion & In-Memory Reductions",
      description: `In src/app/api/spending/route.ts, line 19 fetches all 28,202 transaction dates into Node memory on every call just to build a list of available months (YYYY-MM). Then it loads up to thousands of raw transaction objects to sum in JavaScript loops.`,
      recommendation: "Use SQLite `strftime('%Y-%m', date)` with `DISTINCT` to fetch unique available months instantly, and replace manual array reduction loops with Prisma's `groupBy({ by: ['category'], _sum: { amount: true } })`.",
      estimatedImpact: "70% faster execution and >90% reduction in Node.js server memory allocations."
    });
  }

  // Diagnostic 4: Unindexed Text Search in Transactions Ledger
  const searchEp = report.apiBenchmarks.find(b => b.path.includes("search=ICA"));
  if (searchEp && searchEp.latency.p95 > 40) {
    report.diagnostics.push({
      severity: "MEDIUM",
      component: "Database: Transaction Table",
      title: "Full Table Scan on Text Searches & Filter Columns",
      description: `Searching across 28,202 rows (LIKE '%ICA%') requires a sequential table scan because 'description', 'account', and 'note' lack composite indexes or SQLite FTS.`,
      recommendation: "Add indexes on `account` and `[area, type, category]` in `schema.prisma`. For high-speed text search across 100,000+ rows, consider SQLite FTS5 virtual table or trie indexing.",
      estimatedImpact: "Reduces search latency from full-scan time to sub-10ms."
    });
  }

  // Diagnostic 5: Transactions Three-Query Pagination Overhead
  report.diagnostics.push({
    severity: "MEDIUM",
    component: "API: /api/transactions",
    title: "Triple Query on Every Pagination Request",
    description: "Every pagination query executes three separate operations: `count({ where })`, `aggregate({ _sum: { amount: true } })`, and `findMany({ skip, take })`.",
    recommendation: "Bundle `count` and `aggregate` into a single query or cache total counts across same-filter page navigations (e.g. going from page 1 to page 2 does not need to re-count 28,000 rows).",
    estimatedImpact: "Cuts database queries per page flip from 3 to 1."
  });

  // Print diagnostics to console
  for (const diag of report.diagnostics) {
    const badge = diag.severity === "CRITICAL" ? "🚨 CRITICAL" : diag.severity === "HIGH" ? "⚠️  HIGH" : "💡 MEDIUM";
    console.log(`\n${badge}: [${diag.component}] ${diag.title}`);
    console.log(`   ${diag.description}`);
    console.log(`   👉 Fix: ${diag.recommendation}`);
    console.log(`   📈 Potential Gain: ${diag.estimatedImpact}`);
  }

  // Save report JSON
  const jsonPath = path.join(RESULTS_DIR, "perf_summary.json");
  const jsonContent = JSON.stringify(
    report,
    (k, v) => (typeof v === "bigint" ? Number(v) : v),
    2
  );
  fs.writeFileSync(jsonPath, jsonContent);
  console.log(`\n=================================================================`);
  console.log(`✅ Performance benchmark complete! Results saved to:`);
  console.log(`   ${jsonPath}`);
  console.log(`=================================================================\n`);

  return report;
}

runPerformanceTestSuite().catch(err => {
  console.error("Performance benchmark suite fatal error:", err);
  process.exit(1);
});
