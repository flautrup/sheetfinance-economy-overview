# Balans: System Architecture & Improvement Plan

This document provides a comprehensive walkthrough of the **Balans** codebase, its architectural components, database schema, data ingestion pipeline, and a detailed plan for future engineering improvements.

---

## 🏗️ System Architecture

Balans is built as a unified web application using **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. It couples a local SQLite database using **Prisma ORM** with external integrations such as the **Google Sheets API** (for data backup and import) and the **Gemini API** (for automagical transaction classification).

### High-Level System Flow

The diagram below details the data flow between client-side views, backend API routes, the SQLite database, and external integrations (Google Sheets & Gemini AI).

```mermaid
graph TD
    %% Frontend Components
    subgraph Client [Client-Side UI]
        DashboardView["Dashboard (page.tsx)"]
        BucketsView["Four Buckets (buckets/page.tsx)"]
        WealthView["Wealth Ladder (wealth-ladder/page.tsx)"]
        SpendingView["Kassaflöde (spending/page.tsx)"]
        UploadView["Datahantering (upload/page.tsx)"]
        i18n["i18n Localization Context"]
    end

    %% Backend Routes
    subgraph Backend [Next.js API Routes]
        DashboardAPI["/api/dashboard"]
        BucketsAPI["/api/buckets"]
        WealthAPI["/api/wealth-ladder"]
        SpendingAPI["/api/spending"]
        UploadAPI["/api/upload"]
        CategorizeAPI["/api/categorize"]
        TransactionsAPI["/api/transactions"]
        ExportAPI["/api/export"]
        AuthAPI["/api/auth (NextAuth)"]
    end

    %% Database & External
    subgraph DB [Database Layer]
        PrismaClient["Prisma Client"]
        SQLite[("SQLite (dev.db)")]
    end

    subgraph External [External Services]
        GoogleSheets["Google Sheets API"]
        Gemini["Google Gemini 2.5 Flash API"]
    end

    %% Data Ingestion Connections
    UploadView -->|CSV Upload| UploadView
    UploadView -->|Raw Transactions| CategorizeAPI
    CategorizeAPI -->|Analyze Descriptions| Gemini
    Gemini -->|Categorized JSON| CategorizeAPI
    CategorizeAPI -->|Review Table| UploadView
    UploadView -->|Save Transactions| TransactionsAPI
    TransactionsAPI -->|Prisma Client| PrismaClient

    %% Traditional Google Sheets Inflow/Outflow
    UploadView -->|Sheets URL + Token| UploadAPI
    UploadAPI -->|Fetch Spreadsheets| GoogleSheets
    UploadAPI -->|Prisma client delete & createMany| PrismaClient
    UploadView -->|Sheets URL + Token| ExportAPI
    ExportAPI -->|Fetch DB Data| PrismaClient
    ExportAPI -->|Put Values| GoogleSheets

    %% Auth Connections
    UploadView -->|Trigger Login| AuthAPI
    AuthAPI -->|Retrieve Google AuthToken| GoogleSheets

    %% Database Connections
    PrismaClient <--> SQLite
    
    %% API to DB Queries
    DashboardAPI -->|Query Balances & Tx| PrismaClient
    BucketsAPI -->|Query Balances & Scenarios| PrismaClient
    WealthAPI -->|Query Balances & Tx| PrismaClient
    SpendingAPI -->|Query Tx| PrismaClient

    %% API to UI Data flow
    DashboardAPI -.->|DashboardData JSON| DashboardView
    BucketsAPI -.->|BucketsData JSON| BucketsView
    WealthAPI -.->|WealthData JSON| WealthView
    SpendingAPI -.->|SpendingData JSON| SpendingView
```

---

## 🗄️ Database & Schema Walkthrough

The project utilizes Prisma as an ORM to interact with a SQLite database (`prisma/dev.db`). The database schema is defined in [schema.prisma](file:///home/fredrik/Documents/GitHub/economy-overview/prisma/schema.prisma) and consists of four main models:

```mermaid
erDiagram
    Transaction {
        String id PK
        String hash UK
        DateTime date
        String area
        String category
        String type
        String description
        String account
        String transferFrom
        String transferTo
        Float amount
        String note
        DateTime createdAt
    }

    Balance {
        String id PK
        DateTime date
        String description
        String category
        String type
        Float value
        DateTime createdAt
    }

    BucketMapping {
        String id PK
        String balanceDescription UK
        String bucket
    }

    BucketScenario {
        String id PK
        String bucket UK
        Float targetAmount
        Float expectedGrowth
        Int horizonYears
    }

    TaxonomyNode {
        String id PK
        String area
        String type
        String category
        DateTime createdAt
    }

    UserCorrection {
        String id PK
        String description UK
        String correctedArea
        String correctedType
        String correctedCategory
        Int usageCount
        DateTime createdAt
        DateTime updatedAt
    }
```

### 1. `Transaction`
* Represents individual banking transactions ingested from bank CSV files or a Google Sheet.
* Fields like `area` (e.g. *Utgift*, *Inkomst*, *Överföring*), `type` (e.g. *Mat & dryck*), and `category`/subtype (e.g. *Livsmedel*) represent the 3-tier taxonomy map.

### 2. `Balance`
* Represents balance sheet historical snapshots (Asset vs Liability values).
* Sourced from a user's `Balansräkning` sheet to track net worth, debt, and assets over time.

### 3. `BucketMapping`
* Maps balance sheet accounts (`balanceDescription`) to one of the four RikaTillsammans buckets: `BUFFER`, `PRESERVE`, `GROWTH`, or `PLAY`.
* Configurable on the mapping frontend page `/buckets/mapping`.

### 4. `BucketScenario`
* Stores targeted asset allocation profiles, compound growth rates, and investment timeframes for each b## 📁 Codebase Directory Structure

```
├── prisma/
│   ├── dev.db                       # SQLite Database file (ignored by Git)
│   └── schema.prisma                # Prisma Database Schema
├── src/
│   ├── app/                         # Next.js App Router Pages & APIs
│   │   ├── api/                     # Backend API endpoints
│   │   │   ├── auth/                # NextAuth Google authentication
│   │   │   ├── buckets/             # Scenarios and mappings endpoints
│   │   │   ├── categorize/          # Gemini API transaction classifier
│   │   │   ├── dashboard/           # Home dashboard analytics aggregator
│   │   │   ├── export/              # Google Sheets exporter
│   │   │   ├── reset/               # [NEW] Database reset and stats endpoint
│   │   │   ├── spending/            # Cashflow trend & category analyzer
│   │   │   ├── transactions/        # Transaction ledger queries & writers
│   │   │   ├── upload/              # Sheets ingestion sync endpoint
│   │   │   └── wealth-ladder/       # Passive income and tier calculator
│   │   ├── buckets/                 # Buckets View (Targets and Mappings UI)
│   │   ├── settings/                # [NEW] Settings panel page
│   │   ├── spending/                # Kassaflöde (Cashflow/Spending UI)
│   │   ├── upload/                  # Datahantering (Google Sheet Sync & AI UI)
│   │   ├── wealth-ladder/           # Wealth Ladder progression UI
│   │   ├── favicon.ico
│   │   ├── globals.css              # Global styling variables & utility classes
│   │   ├── layout.tsx               # Root layout wrapping sidebar & topbar
│   │   └── page.tsx                 # Dashboard home component
│   ├── components/                  # Shared React components
│   │   ├── LayoutWrapper.tsx        # [NEW] Client-side sidebar drawer manager
│   │   ├── Providers.tsx            # SessionProvider wrapper
│   │   ├── Sidebar.tsx              # Sidebar navigation (with slide drawer classes)
│   │   └── Topbar.tsx               # Header toolbar (with hamburger menu)
│   ├── lib/                         # Utility library files
│   │   ├── auth.ts                  # [NEW] Centralized auth configuration
│   │   ├── finance.ts               # [NEW] Unified financial business logic
│   │   ├── i18n.tsx                 # Localization provider (Swedish & English)
│   │   ├── preClassifier.ts         # [NEW] Local keyword pre-classification rules
│   │   └── prisma.ts                # Hot-reload safe global Prisma Client instance
│   ├── middleware.ts                # [NEW] Route protection middleware
├── .env.local                       # Environment credentials (ignored by Git)
├── Dockerfile                       # Multi-stage Dockerfile (dev, builder, runner)
├── docker-compose.yml               # Local development container orchestration
├── package.json                     # Node dependencies & project scripts
└── tsconfig.json                    # TS configuration
```

---

## ✅ Implemented System Upgrades

The following optimizations have been fully implemented, compiling successfully with zero warnings/errors in the production build:

### 1. 🔒 Security & Session Protection
* **Session Wrapper**: Configured [auth.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/lib/auth.ts) to define and share `authOptions`.
* **API Validation**: Secured all endpoint query and mutation routes under `/api` by validating active NextAuth sessions.
* **Global Middleware Redirect**: Introduced [middleware.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/middleware.ts) to automatically intercept page loads and redirect unauthenticated users to the sign-in screen.

### 2. ⚡ Unified Business Logic Service
* **Finance Service**: Consolidated rolling spending calculations, average monthly expenses, solvency ratios, and runway computations into [finance.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/lib/finance.ts).
* **Database Aggregations**: Upgraded the calculations to use Prisma's native database aggregation (`_sum` and `groupBy`) instead of array reductions in Node memory.

### 3. 📱 Mobile Responsiveness Layout
* **Drawer Manager**: Created [LayoutWrapper.tsx](file:///home/fredrik/Documents/GitHub/economy-overview/src/components/LayoutWrapper.tsx) client shell to coordinate menu toggle states.
* **Responsive Navigation**: Added slide drawers, overlays, and hamburger toggles on [Sidebar.tsx](file:///home/fredrik/Documents/GitHub/economy-overview/src/components/Sidebar.tsx) and [Topbar.tsx](file:///home/fredrik/Documents/GitHub/economy-overview/src/components/Topbar.tsx).

### 4. 📅 Month/Year Filters & Ledgers Drill-down
* **Spending Filters**: Added year and month filter parameters to the spending API and integrated interactive selector dropdowns on the kassaflöde view.
* **Category Ledgers**: Implemented category drill-down details by fetching transactions from the transactions GET endpoint and showing them inside a visual modal sheet.

### 5. ⚙️ Settings Administration
* **Controls Dashboard**: Built the settings view page [settings/page.tsx](file:///home/fredrik/Documents/GitHub/economy-overview/src/app/settings/page.tsx) with statistics counts, logout triggers, and a database clear tool.

### 6. 🤖 Ingestion Optimization
* **Local Pre-classification Rules**: Built [preClassifier.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/lib/preClassifier.ts) to instantly resolve categories for common services (ICA, Swish, Netflix, Lön), skipping AI calls for known descriptions.
* **Prompt Batching**: Configured the categorization API to batch unclassified lines in chunks of 50 before sending them to Gemini 2.5 Flash, ensuring token compliance and parsing reliability.

### 7. 🐳 Containerized Development Environment
* **Multi-Stage Dockerfile**: Implemented a multi-stage [Dockerfile](file:///home/fredrik/Documents/GitHub/economy-overview/Dockerfile) targeting `dev` for local development and `runner` for production.
* **Live-Reload & Schema Sync**: [docker-compose.yml](file:///home/fredrik/Documents/GitHub/economy-overview/docker-compose.yml) binds host source code with anonymous volumes for `node_modules` and `.next`, enabling instant Fast Refresh. It boots with `npx prisma db push && npm run dev` to automatically synchronize database changes directly to the host's `prisma/dev.db`.
* **Seamless Dual Env Loading**: Injects both `.env` and `.env.local` directly into the container so AI features (`GEMINI_API_KEY`) and Google OAuth authentication work out-of-the-box.

---

### 8. 🔍 Occurrence-Aware Hash Deduplication & Database Indexing
* **Composite SHA-256 Fingerprinting**: Generates deterministic SHA-256 hashes incorporating bank reference/saldo or occurrence index (`date|amount|description|account|occurrenceIndex`). This preserves legitimate identical same-day transactions (e.g. buying two separate 35 kr coffees) while preventing duplicate re-uploads.
* **Database Indexing**: Added indexes on `Transaction([hash], [date], [area, date], [category])` and `Balance([date], [type])` in [schema.prisma](file:///home/fredrik/Documents/GitHub/economy-overview/prisma/schema.prisma) to ensure sub-millisecond lookups across tens of thousands of rows.
* **$O(1)$ Batch Ingestion**: Replaced the sequential N+1 query loop with a single batch `in: candidateHashes` query and atomic `createMany`.
* **Historical Backfill**: Successfully backfilled all existing 28,202 historical transactions in `prisma/dev.db` with deterministic hashes.

### 9. 🏷️ Database-Backed Taxonomy & Custom Merchant Rules
* **Persistent Models**: Introduced `TaxonomyNode` and dynamic database rules in [schema.prisma](file:///home/fredrik/Documents/GitHub/economy-overview/prisma/schema.prisma).
* **Seeded Swedish Rules Engine**: Initialized 75 merchant keyword rules covering grocery chains, streaming platforms, transit, fuel, utilities, and restaurants in [defaultRules.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/lib/defaultRules.ts).
* **Interactive Rule Simulator & Taxonomy UI**: Upgraded [buckets/mapping/page.tsx](file:///home/fredrik/Documents/GitHub/economy-overview/src/app/buckets/mapping/page.tsx) with a live Rule Simulator, real-time search filters, taxonomy creation, and rule deletion confirmations.

### 10. 🧠 Gemini Few-Shot Self-Learning Feedback Loop
* **User Correction Storage**: Added `UserCorrection` model to log manual overrides when users edit categories or areas.
* **Dynamic Few-Shot Injection**: [api/categorize/route.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/app/api/categorize/route.ts) queries the top 20 most frequent user corrections and injects them directly into Gemini 2.5 Flash prompts, allowing the AI to learn user-specific classification habits automatically.
* **Continuous Feedback**: User corrections are captured both during CSV upload review and directly from the Transaction Ledger.

### 11. 🔄 Google Sheets Sync Parity & Data Safety
* **10-Column Canonical Round-Trip**: Unified [api/export/route.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/app/api/export/route.ts) and [api/upload/route.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/app/api/upload/route.ts) across the canonical 10 columns (`Datum`, `Omrade`, `Kategori`, `Typ`, `Beskrivning`, `Konto`, `Överföring från konto`, `Överföring till konto`, `Summa`, `Anteckning`).
* **Resilient Header Matching**: Safely handles Swedish character variants (`Område`/`Omrade`, `Summa`/`Belopp`, etc.) and automatically detects target sheet tabs.
* **Import Mode Selection**: Added dual-mode import in [upload/page.tsx](file:///home/fredrik/Documents/GitHub/economy-overview/src/app/upload/page.tsx):
  - **Lägg till & Sammanfoga (Default)**: Merges new rows and automatically skips existing transactions via SHA-256 fingerprint deduplication.
  - **Ersätt all data**: Clears previous transactions with an explicit confirmation safeguard.

### 12. 📊 Transaction Ledger & Management UI (`/transactions`)
* **Dedicated Ledger View**: Built [transactions/page.tsx](file:///home/fredrik/Documents/GitHub/economy-overview/src/app/transactions/page.tsx) featuring responsive data tables, KPI metrics, and pagination.
* **Real-Time Filters & Search**: Search across description, note, or account with debounced queries, cascading Area/Type/Category dropdowns, and date range filters.
* **SHA-256 Fingerprint Inspector**: Inspect transaction fingerprints, UUIDs, occurrence index explanations, and timestamps.
* **Inline Reclassification & Batch Actions**: Select multiple transactions for batch categorization or deletion, and edit individual transactions with immediate feedback to the AI learning loop.

---

## 🚀 Future Roadmap & Next Horizons

* **Automated Bank API Ingestion**: Direct Open Banking (PSD2 / Tink) integration for automated daily transaction synchronization.
* **Multi-Currency Support**: Automated conversion rates for foreign purchases and accounts.
* **Export Scheduling**: Automated weekly/monthly backups to Google Drive or Google Sheets via cron.
