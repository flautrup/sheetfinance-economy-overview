import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sheetUrl, accessToken } = await req.json();
    const effectiveAccessToken = (session as { accessToken?: string })?.accessToken || accessToken;

    if (!sheetUrl || !effectiveAccessToken) {
      return NextResponse.json({ 
        error: "Saknar Google-åtkomsttoken eller kalkylarks-URL. Vänligen logga ut och logga in igen med Google.", 
        isAuthError: !effectiveAccessToken 
      }, { status: 400 });
    }

    // Extract spreadsheetId from URL
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      return NextResponse.json({ error: "Invalid Google Sheet URL" }, { status: 400 });
    }
    const spreadsheetId = match[1];

    // Fetch all transactions from DB
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "asc" }
    });

    if (transactions.length === 0) {
      return NextResponse.json({ error: "No transactions found in database to export" }, { status: 400 });
    }

    // Detect spreadsheet sheets to find "Transaktioner" or fallback to first sheet
    let targetSheetTitle = "Sheet1";
    try {
      const metaRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
        {
          headers: { Authorization: `Bearer ${effectiveAccessToken}` }
        }
      );
      if (metaRes.ok) {
        const metaData = await metaRes.json();
        const titles: string[] = (metaData.sheets || []).map((s: { properties?: { title?: string } }) => s.properties?.title || "");
        const matched = titles.find(t => t.toLowerCase().includes("transaktion"));
        if (matched) targetSheetTitle = matched;
        else if (titles.length > 0 && titles[0]) targetSheetTitle = titles[0];
      }
    } catch (err) {
      console.warn("Could not inspect sheet titles, falling back to Sheet1:", err);
    }

    // Prepare complete 10-column data for Google Sheets
    const values = [
      [
        "Datum",
        "Omrade",
        "Kategori",
        "Typ",
        "Beskrivning",
        "Konto",
        "Överföring från konto",
        "Överföring till konto",
        "Summa",
        "Anteckning"
      ],
      ...transactions.map(t => [
        t.date instanceof Date ? t.date.toISOString().substring(0, 10) : String(t.date).substring(0, 10),
        t.area || "",
        t.category || "",
        t.type || "",
        t.description || "",
        t.account || "",
        t.transferFrom || "",
        t.transferTo || "",
        t.amount.toString(),
        t.note || ""
      ])
    ];

    const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheetTitle)}:clear`;
    const clearRes = await fetch(clearUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${effectiveAccessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!clearRes.ok) {
      const err = await clearRes.json();
      console.error("Failed to clear sheet:", err);
    }

    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheetTitle)}!A1?valueInputOption=USER_ENTERED`;
    const updateRes = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${effectiveAccessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        range: `${targetSheetTitle}!A1`,
        majorDimension: "ROWS",
        values: values
      })
    });

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      throw new Error(updateData.error?.message || "Failed to write to Google Sheet");
    }

    return NextResponse.json({ success: true, rowsExported: transactions.length, sheet: targetSheetTitle });
  } catch (error: unknown) {
    const rawMessage = error instanceof Error ? error.message : String(error);
    console.error("Export error:", error);

    const errObj = error as Record<string, unknown> | null;
    const isAuthError =
      rawMessage.includes("invalid authentication credentials") ||
      rawMessage.includes("OAuth 2 access token") ||
      rawMessage.includes("Invalid Credentials") ||
      errObj?.status === 401 ||
      errObj?.code === 401;

    if (isAuthError) {
      return NextResponse.json({
        error: "Google-inloggningen har löpt ut eller saknar behörighet för kalkylark. Logga ut och logga in igen med Google för att förnya åtkomsten.",
        isAuthError: true,
        details: rawMessage,
      }, { status: 401 });
    }

    return NextResponse.json({ error: rawMessage }, { status: 500 });
  }
}
