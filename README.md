# Economy Overview Dashboard

A modern, highly visual, and comprehensive personal finance dashboard built to give you total control over your economy. 

This application takes your raw bank transactions and transforms them into actionable insights, utilizing a "Four Bucket Model" for wealth mapping, an AI-powered transaction categorizer, and deep historical analytics to track your runway and solvency over time.

---

## 🌟 Key Features

- **Hybrid Rules + AI Categorization:** Drag and drop raw CSV exports from your bank. Known recurring items (e.g. Swish, Spotify, ICA) are classified instantly using a local regex pre-classifier, while the rest are batched and classified in chunks using Google's **Gemini 2.5 Flash** API.
- **The Four Bucket Model:** Visually map your net capital across four distinct buckets (*Buffer*, *Preserve*, *Growth*, and *Play*), complete with progress bars tracking targets set in mapping settings.
- **Historical Analytics:** Track key metrics over time including your Total Debt, Own Capital (Net Worth), Solvency (Soliditet), and your Liquidity Runway (how many months you can survive based on trailing spend).
- **Deep Spending Insights:** Analyze your expenses month-over-month, filter by year/month, and click on categories to drill down into the transaction ledgers.
- **Google Sheets Integration:** Import spreadsheets directly, or natively export your SQLite transaction database back to a Google Sheet for ultimate safety.
- **Bilingual Support:** Fully localized in both Swedish and English.
- **Admin Control Panel**: View database statistics (transactions, balances, mapping counts) and safely wipe database data.
- **Security First**: Middleware enforcements secure all pages and API routes against unauthorized visits.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Design System with Glassmorphism)
- **Database:** SQLite (Local)
- **ORM:** Prisma
- **AI Engine:** Google Generative AI (`@google/generative-ai`)
- **Authentication:** NextAuth.js (Google OAuth)
- **Charting:** Recharts

---

## 🚀 Getting Started

Follow these steps to run the dashboard locally on your machine.

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
You need to set up two environment files in the root of the project.

**`.env`** (Database & Auth Config)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_a_random_secret_string_here"
```

**`.env.local`** (API Keys & Secrets - **DO NOT COMMIT TO GIT**)
```env
# Google OAuth for logging in and exporting to Sheets
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Gemini API for AI CSV Categorization
GEMINI_API_KEY="your_gemini_api_key_from_google_ai_studio"
```

### 3. Initialize the Database
Push the Prisma schema to create your local SQLite database file (`prisma/dev.db`):
```bash
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 🐳 Running with Docker Compose

Alternatively, you can build and run the entire stack inside a Docker container:

1. Configure your `.env` and `.env.local` files in the project root.
2. Build the Docker container image:
   ```bash
   docker-compose build
   ```
3. Boot the container service:
   ```bash
   docker-compose up
   ```
4. Access [http://localhost:3000](http://localhost:3000) inside your web browser.

> [!NOTE]
> On startup, Docker Compose will automatically execute `npx prisma db push` to initialize and align your SQLite schema. The SQLite database file will persist across runs in a named Docker volume (`prisma-db`).

---

## 📂 Data Management Workflow

1. **Upload:** Navigate to the `Datahantering` page in the sidebar.
2. **Drop CSV:** Drag and drop a CSV from your bank (e.g., Swedbank, Nordea) into the AI dropzone.
3. **Refine:** Wait a few seconds for Gemini to categorize the lines. Review the results in the table, adjust the dropdowns if necessary, assign an "Account Owner", and click **Spara till Databas**.
4. **Analyze:** Navigate to the Dashboard or Buckets page to see your net worth update in real-time.

---

## 🔒 Privacy & Security

This repository is configured to **never** track your financial data. The `.gitignore` is strictly set up to ignore:
- All SQLite databases (`*.db`, `*.sqlite`)
- All bank exports (`*.csv`)
- All environment secret files (`.env`, `.env.local`)

You can safely commit code changes and push to GitHub without leaking your economy data.
