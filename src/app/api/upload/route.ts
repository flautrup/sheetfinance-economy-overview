import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

// Utility to parse Swedish formatted numbers (e.g. "−10,00" or "-10,00" to -10.00)
function parseSwedishNumber(val: string): number {
  if (!val) return 0;
  const clean = val.replace("−", "-").replace(",", ".").replace(/\s+/g, "");
  return parseFloat(clean) || 0;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { txSheetUrl, balSheetUrl, accessToken, mode = "merge" } = await req.json();

    if ((!txSheetUrl && !balSheetUrl) || !accessToken) {
      return NextResponse.json({ success: false, error: "Missing sheetUrls or accessToken" }, { status: 400 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const sheets = google.sheets({ version: "v4", auth });

    let txCount = 0;
    let balCount = 0;

    const extractId = (url: string) => {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      return match ? match[1] : null;
    };

    if (txSheetUrl) {
      const txId = extractId(txSheetUrl);
      if (!txId) {
        return NextResponse.json({ success: false, error: "Invalid Transaktioner Google Sheet URL" }, { status: 400 });
      }
      
      const meta = await sheets.spreadsheets.get({ spreadsheetId: txId });
      const sheetTitles = (meta.data.sheets || [])
        .map((s) => s.properties?.title)
        .filter((t): t is string => typeof t === "string");
      const txTab = sheetTitles.find((t: string) => t?.toLowerCase().includes("transaktion")) || sheetTitles[0];

      const resp = await sheets.spreadsheets.values.get({
        spreadsheetId: txId,
        range: `${txTab}!A:Z`
      });
      const rows = resp.data.values;
      if (rows && rows.length > 1) {
        const headers = rows[0].map((h: string) => h?.trim());
        const findHeader = (...names: string[]) => {
          const lower = names.map(n => n.toLowerCase());
          return headers.findIndex(h => h && lower.includes(h.toLowerCase()));
        };

        const dateIdx = findHeader("Datum", "Date");
        const areaIdx = findHeader("Omrade", "Område", "Area");
        const catIdx = findHeader("Kategori", "Category");
        const typeIdx = findHeader("Typ", "Type");
        const descIdx = findHeader("Beskrivning", "Description");
        const accIdx = findHeader("Konto", "Account");
        const transferFromIdx = findHeader("Överföring från konto", "Överföring från", "From Account", "transferFrom");
        const transferToIdx = findHeader("Överföring till konto", "Överföring till", "To Account", "transferTo");
        const amountIdx = findHeader("Summa", "Belopp", "Amount");
        const noteIdx = findHeader("Anteckning", "Note", "Notat");

        const dataRows = rows.slice(1).filter(r => r.length > 1 && r.some((c: string) => c && c.trim() !== ""));
        const occurrenceTracker: Record<string, number> = {};

        const preparedTxs = dataRows.map(r => {
          const rawDate = dateIdx !== -1 && r[dateIdx] ? new Date(r[dateIdx]) : new Date();
          const parsedDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;
          const dateStr = parsedDate.toISOString().slice(0, 10);
          const descStr = descIdx !== -1 && r[descIdx] ? String(r[descIdx]).trim() : "";
          const accStr = accIdx !== -1 && r[accIdx] ? String(r[accIdx]).trim() : "";
          const amountVal = amountIdx !== -1 ? parseSwedishNumber(r[amountIdx] || "0") : 0;

          const occurrenceKey = `${dateStr}|${amountVal}|${descStr.toLowerCase()}|${accStr.toLowerCase()}`;
          const occurrenceIndex = (occurrenceTracker[occurrenceKey] = (occurrenceTracker[occurrenceKey] ?? -1) + 1);

          const hash = crypto
            .createHash("sha256")
            .update(`${dateStr}|${amountVal}|${descStr.toLowerCase()}|${accStr.toLowerCase()}|${occurrenceIndex}`)
            .digest("hex");

          return {
            hash,
            date: parsedDate,
            area: areaIdx !== -1 && r[areaIdx] ? String(r[areaIdx]).trim() : null,
            category: catIdx !== -1 && r[catIdx] ? String(r[catIdx]).trim() : null,
            type: typeIdx !== -1 && r[typeIdx] ? String(r[typeIdx]).trim() : null,
            description: descStr || null,
            account: accStr || null,
            transferFrom: transferFromIdx !== -1 && r[transferFromIdx] ? String(r[transferFromIdx]).trim() : null,
            transferTo: transferToIdx !== -1 && r[transferToIdx] ? String(r[transferToIdx]).trim() : null,
            amount: amountVal,
            note: noteIdx !== -1 && r[noteIdx] ? String(r[noteIdx]).trim() : null
          };
        });

        if (mode === "replace") {
          await prisma.transaction.deleteMany({});
          await prisma.transaction.createMany({ data: preparedTxs });
          txCount = preparedTxs.length;
        } else {
          // Merge & Deduplicate
          const candidateHashes = preparedTxs.map(t => t.hash);
          const existingRows = await prisma.transaction.findMany({
            where: { hash: { in: candidateHashes } },
            select: { hash: true }
          });
          const existingHashSet = new Set(existingRows.map(r => r.hash));
          const toInsert = preparedTxs.filter(t => !existingHashSet.has(t.hash));

          if (toInsert.length > 0) {
            await prisma.transaction.createMany({ data: toInsert });
          }
          txCount = toInsert.length;
        }
      }
    }

    if (balSheetUrl) {
      const balId = extractId(balSheetUrl);
      if (!balId) {
        return NextResponse.json({ success: false, error: "Invalid Balansräkning Google Sheet URL" }, { status: 400 });
      }

      const meta = await sheets.spreadsheets.get({ spreadsheetId: balId });
      const sheetTitles = (meta.data.sheets || [])
        .map((s) => s.properties?.title)
        .filter((t): t is string => typeof t === "string");
      const balTab = sheetTitles.find((t: string) => t?.toLowerCase().includes("balans")) || sheetTitles[0];

      const resp = await sheets.spreadsheets.values.get({
        spreadsheetId: balId,
        range: `${balTab}!A:Z`
      });
      const rows = resp.data.values;
      if (rows && rows.length > 1) {
        const headers = rows[0].map((h: string) => h?.trim());
        const findHeader = (...names: string[]) => {
          const lower = names.map(n => n.toLowerCase());
          return headers.findIndex(h => h && lower.includes(h.toLowerCase()));
        };

        const dateIdx = findHeader("BalDatum", "Datum", "Date");
        const descIdx = findHeader("BalBeskrivning", "Beskrivning", "Description");
        const catIdx = findHeader("BalKategori", "Kategori", "Category");
        const typeIdx = findHeader("BalTyp", "Typ", "Type");
        const valIdx = findHeader("BalVärde", "Värde", "Belopp", "Value", "Amount");

        const dataRows = rows.slice(1).filter(r => r.length > 1 && r.some((c: string) => c && c.trim() !== ""));
        const balPayload = dataRows.map(r => {
          const rawDate = dateIdx !== -1 && r[dateIdx] ? new Date(r[dateIdx]) : new Date();
          const parsedDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;
          return {
            date: parsedDate,
            description: descIdx !== -1 && r[descIdx] ? String(r[descIdx]).trim() : null,
            category: catIdx !== -1 && r[catIdx] ? String(r[catIdx]).trim() : null,
            type: typeIdx !== -1 && r[typeIdx] ? String(r[typeIdx]).trim() : null,
            value: valIdx !== -1 ? parseSwedishNumber(r[valIdx] || "0") : 0
          };
        });

        if (mode === "replace") {
          await prisma.balance.deleteMany({});
          await prisma.balance.createMany({ data: balPayload });
          balCount = balPayload.length;
        } else {
          // Merge by updating only snapshots for the specific dates in the sheet
          const uniqueDates = Array.from(new Set(balPayload.map(b => b.date.toISOString()))).map(d => new Date(d));
          await prisma.balance.deleteMany({
            where: { date: { in: uniqueDates } }
          });
          await prisma.balance.createMany({ data: balPayload });
          balCount = balPayload.length;
        }
      }
    }

    return NextResponse.json({ success: true, txCount, balCount, mode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Upload parse error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
