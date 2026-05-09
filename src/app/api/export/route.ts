import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { sheetUrl, accessToken } = await req.json();

    if (!sheetUrl || !accessToken) {
      return NextResponse.json({ error: "Missing sheetUrl or accessToken" }, { status: 400 });
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

    // Prepare data for Google Sheets
    // Columns: Date, Description, Amount, Area, Category
    const values = [
      ["Datum", "Beskrivning", "Belopp", "Område", "Kategori"],
      ...transactions.map(t => [
        t.date.toISOString().substring(0, 10),
        t.description,
        t.amount.toString(),
        t.area || "",
        t.category || ""
      ])
    ];

    // 1. Clear the existing sheet (optional, but good for a fresh backup)
    // We will assume writing to Sheet1
    const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1:clear`;
    const clearRes = await fetch(clearUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!clearRes.ok) {
      const err = await clearRes.json();
      console.error("Failed to clear sheet:", err);
      // We don't fail hard here, we just append or try to write anyway
    }

    // 2. Write the new data
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`;
    const updateRes = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        range: "Sheet1!A1",
        majorDimension: "ROWS",
        values: values
      })
    });

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      throw new Error(updateData.error?.message || "Failed to write to Google Sheet");
    }

    return NextResponse.json({ success: true, rowsExported: transactions.length });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
