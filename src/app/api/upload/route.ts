import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

    const { txSheetUrl, balSheetUrl, accessToken } = await req.json();

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
        const dateIdx = headers.indexOf("Datum");
        const areaIdx = headers.indexOf("Omrade");
        const catIdx = headers.indexOf("Kategori");
        const typeIdx = headers.indexOf("Typ");
        const descIdx = headers.indexOf("Beskrivning");
        const accIdx = headers.indexOf("Konto");
        const transferFromIdx = headers.indexOf("Överföring från konto");
        const transferToIdx = headers.indexOf("Överföring till konto");
        const amountIdx = headers.indexOf("Summa");
        const noteIdx = headers.indexOf("Anteckning");

        const dataRows = rows.slice(1).filter(r => r.length > 3);
        const txPayload = dataRows.map(r => ({
          date: r[dateIdx] ? new Date(r[dateIdx]) : new Date(),
          area: areaIdx !== -1 ? r[areaIdx] : null,
          category: catIdx !== -1 ? r[catIdx] : null,
          type: typeIdx !== -1 ? r[typeIdx] : null,
          description: descIdx !== -1 ? r[descIdx] : null,
          account: accIdx !== -1 ? r[accIdx] : null,
          transferFrom: transferFromIdx !== -1 ? r[transferFromIdx] : null,
          transferTo: transferToIdx !== -1 ? r[transferToIdx] : null,
          amount: amountIdx !== -1 ? parseSwedishNumber(r[amountIdx] || "0") : 0,
          note: noteIdx !== -1 ? r[noteIdx] : null
        }));

        await prisma.transaction.deleteMany({});
        await prisma.transaction.createMany({ data: txPayload });
        txCount = txPayload.length;
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
        const dateIdx = headers.indexOf("BalDatum");
        const descIdx = headers.indexOf("BalBeskrivning");
        const catIdx = headers.indexOf("BalKategori");
        const typeIdx = headers.indexOf("BalTyp");
        const valIdx = headers.indexOf("BalVärde");

        const dataRows = rows.slice(1).filter(r => r.length > 3);
        const balPayload = dataRows.map(r => ({
          date: r[dateIdx] ? new Date(r[dateIdx]) : new Date(),
          description: descIdx !== -1 ? r[descIdx] : null,
          category: catIdx !== -1 ? r[catIdx] : null,
          type: typeIdx !== -1 ? r[typeIdx] : null,
          value: valIdx !== -1 ? parseSwedishNumber(r[valIdx] || "0") : 0
        }));

        await prisma.balance.deleteMany({});
        await prisma.balance.createMany({ data: balPayload });
        balCount = balPayload.length;
      }
    }

    return NextResponse.json({ success: true, txCount, balCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Upload parse error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
