import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { transactions } = await req.json();
    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing in .env.local" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build the taxonomy prompt
    const prompt = `
You are a highly accurate financial transaction categorizer. You must strictly use ONLY the following taxonomy (Area -> Type -> Category/Subtype) to categorize the provided transactions based on their descriptions. Do not invent categories.

Taxonomy:
Utgift -> Kommunikation -> [Tv, Fast telefoni, Mobil telefoni, Internet, Mobilt internet, Annat]
Utgift -> Mat & dryck -> [Livsmedel, Luncher, Fika, Frukost, Middag, Alkohol, Godis/Snacks, Snabbmat, Restaurang, Annat]
Utgift -> Transport -> [Bil, Båt, Flyg, Taxi, Tåg, Kollektivt, Bränsle, Parkering/Vägtullar, MC/Moped, Cykel, Annat]
Utgift -> Boende -> [Hyra/Avgift, El, Gas/Fjärrvärme Vatten, Sophämtning, Garage/Parkering, Reparation/Drift Fritidshus, Vitvaror, Möbler/Husgeråd, Renovering/Bygg, Hushållsnära tjänster, Larm]
Utgift -> Försäkring -> [Bil/Fordon, Hem, Villa, Bostadsrätt, Liv/Sjuk/Olycksfall, Barnförsäkring]
Utgift -> Nöjen/Shopping -> [Kläder/Skor, Bio, Fest, Resor, Sport/Fritid/Hälsa, Spel och dobbel, Musik/Show/Konsert, Media/Bok/Kultur, Hemelektronik, Shopping]
Utgift -> Lån -> [Bolån, Banklån, Studielån, Snabblån, Billån, Återbetalning]
Utgift -> Övrigt -> [Ålderspension, Hygien, A-kassa, Fackavgift, Kåravgift, Studiematerial, Förbrukningsvaror, Vård, Annat]

Inkomst -> Inkomst -> [Lön, Sommarjobb, Gåva, Övrig inkomst, A-kassa, Studiebidrag/Lån, Bidrag, Föräldrapenning, Barnbidrag, Skuld, Från sparande, Pension, Återbäring, Korrigering, Sjukpenning, Utlägg]
Överföring -> Överföring -> [Sparande, Bankkonto, Fonder, Aktier, Pensionsspar, Madrassen, Sparmål, Övrigt]

Input Transactions:
${JSON.stringify(transactions.map((t: any, index: number) => ({ id: index, description: t.description, amount: t.amount })), null, 2)}

Output JSON ONLY! Return an array of objects with the exact schema:
[ { "id": number, "area": string, "type": string, "category": string } ]
Make sure area is one of "Utgift", "Inkomst", "Överföring".
If an amount is positive, it's likely an "Inkomst" or "Överföring". If an amount is negative, it's an "Utgift" or "Överföring". Use your best judgement based on the Swedish description.
Do not wrap the JSON in markdown blocks like \`\`\`json, just return raw JSON string.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Parse the JSON (clean up markdown if Gemini decides to include it anyway)
    const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    let categories;
    try {
      categories = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini output:", cleanedText);
      throw new Error("AI returned invalid JSON");
    }

    // Merge categories back into transactions
    const categorizedTransactions = transactions.map((t: any, idx: number) => {
      const cat = categories.find((c: any) => c.id === idx);
      return {
        ...t,
        area: cat ? cat.area : "Utgift",
        type: cat ? cat.type : "Övrigt",
        category: cat ? cat.category : "Annat"
      };
    });

    return NextResponse.json({ transactions: categorizedTransactions });
  } catch (error: any) {
    console.error("LLM Categorization error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
