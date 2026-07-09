# Economy Overview

## Goal
I want to create a tool that can ingest my transactions with classifications and som e general personal finance overview from a Google Sheet. I then want to get an overview of my economy over time based on these two models
1. Four bucket model (information can be found here https://rikatillsammans.se/spara-och-investera/fyra-hinkar-modellen/)
2. Wealth ladder (information can be found here https://rikatillsammans.se/verktyg/rikedomsniva/, https://rikatillsammans.se/spara-och-investera/rikedomstrappan/)
3. General oveview of important metrics like liquidity, solvency, capital, net worth, debt, savings rate etc.

I also want to get an overview of how I spend my money each month.

The tool should have support for Swedish and English.

## User flow
1. Login
2. Get an overview and navigation
3. Navigate to a specific views for each goal (four bucket model, wealth ladder, general overview, monthly spending)
4. Have filters to look at data for a specific month or year.
5. Be able to drill down into a specific category to see the transactions that make up the category.

## Authentication
Use Google to authenticate. Use the credentials to get access to google drive which should be used to import and export files.

## Data Model
The data model should be stored in a way that is independent of the UI. It should be able to be queried by the UI to get the data it needed as well as queried using thrid party tools. I should be able to query the data model using SQL.

## Implemented Features
I want this implemented as a web application with a modern UI. I should be able to run the tool locally using docker-compose. As well as be able to host it in cloud if I want.

I would like for the tool to use the google sheets as the source for the transaction. The google sheet is updated manually by me. Example of a row in the transation sheet looks like
Omrade	Datum	Kategori	Typ	Beskrivning	Konto	Överföring från konto	Överföring till konto	Summa	Anteckning
Utgift	2009-11-01	Övrigt	Medlemsskap/Tjänster	Vardagsmeny Nov	Fredrik 			−10,00	

I also have a sheet called Balansräkning that can look like this
BalDatum	BalBeskrivning	BalKategori	BalTyp	BalVärde
2017-12-27	Nordea bankkonto	Likvida medel	Tillgång	63737
2017-12-27	Nordnet perngar	Likvida medel	Tillgång	34554
2017-12-27	Fonder Nordea	Korta placeringar	Tillgång	166436
2017-12-27	Fonder Nordnet	Korta placeringar	Tillgång	59288
2017-12-27	Aktier Nordnet	Korta placeringar	Tillgång	28399
2017-12-27	BMW X1	Maskiner och inventarier	Tillgång	133500
2017-12-27	Golf	Maskiner och inventarier	Tillgång	24200
2017-12-27	Ducati 750 sport	Maskiner och inventarier	Tillgång	13000
2017-12-27	Minimoto	Maskiner och inventarier	Tillgång	3000
2017-12-27	Hus	Anläggningstillgångar	Tillgång	4000000
2017-12-27	Qlik	Långsiktiga placeringar	Tillgång	30000
2017-12-27	Billån	Kortfristiga skulder	Skuld	64253
2017-12-27	Hus	Långfristiga skulder	Skuld	2956464
2017-12-27	Skatt	Långfristiga skulder	Skuld	185000
2017-12-27	Studielån	Långfristiga skulder	Skuld	92196

---

## 🛠️ Implemented Architecture & Code Realization (Version 2 Update)

The list below outlines how each of the original goals and requirements have been realized in the active codebase:

### 1. Financial Overview Models
* **Four Bucket Model**: Accessible on the `/buckets` page. Allows configuring expected growth, target allocations, and investment horizons for the Buffer, Preserve, Growth, and Play buckets.
* **Wealth Ladder (Rikedomstrappan)**: Dynamically calculated on the `/wealth-ladder` page. Maps assets and runway to levels 1 through 6.
* **General Overview & Metrics**: Calculated inside the consolidated service [finance.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/lib/finance.ts) and displayed on the home page dashboard `/`:
  * **Liquidity**: Liquid Capital (Buffer + Preserve balances) and trailing 6-month runway in months.
  * **Solvency**: Solidity percentage (`ownCapital / totalAssets`).
  * **Capital & Net Worth**: Own Capital (Total Assets - Debt).
  * **Debt**: Negative balance liabilities.
  * **Savings Rate**: Rolling 12-month savings rate formula (`(income - expense) / income`).
* **Monthly Spending**: Placed on the `/spending` page with month/year filters, visual category breakdowns, and click triggers to open detail transaction ledgers.
* **Bilingual Translation Support**: Managed via the `useTranslation` locale context wrapper, supporting Swedish (`sv`) and English (`en`).

### 2. Authentication & Data Security
* **Google OAuth**: Handled using `NextAuth.js` with the Google provider configuration.
* **Security Validation**: Enforced active sessions on all state mutations and query API routes under `/api/*`.
* **Redirects**: Handled globally using Next.js Middleware in [middleware.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/middleware.ts).

### 3. Ingestion & Data Portability
* **Google Sheets Sync**: The `/api/upload` endpoint pulls user-configured transactions and balance sheets directly from Google Sheets using Google OAuth API scopes.
* **CSV Parsing & AI Pre-classifier**: Drag-and-drop file ingestion in `/upload` resolves known recurring expenses instantly via local regex rules in [preClassifier.ts](file:///home/fredrik/Documents/GitHub/economy-overview/src/lib/preClassifier.ts), while batching remaining lines to Gemini 2.5 Flash.
* **Google Sheets Export**: Backs up transaction records back to a Google Sheet using the Sheets API client.

### 4. Data Storage & Local Runtime
* **Independent SQL Database**: Configured using Prisma ORM with a local SQLite database file (`prisma/dev.db`), allowing querying via any standard third-party SQL GUI client.
* **Docker Compose**: Containerized execution setup using a multi-stage [Dockerfile](file:///home/fredrik/Documents/GitHub/economy-overview/Dockerfile) and [docker-compose.yml](file:///home/fredrik/Documents/GitHub/economy-overview/docker-compose.yml).



