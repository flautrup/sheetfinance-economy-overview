import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { preClassify } from "@/lib/preClassifier";

interface CategorizedItem {
  id: number;
  area: string;
  type: string;
  category: string;
}

interface RawTransaction {
  date: string;
  description: string;
  amount: number;
}

export async function POST(req: Request) {
  try {
    // 1. Verify Session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactions } = await req.json();
    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing in .env.local" }, { status: 500 });
    }

    // 2. Local Pre-classification Lookup
    const classifiedList = transactions.map((t: RawTransaction, idx: number) => {
      const local = preClassify(t.description);
      if (local) {
        return {
          ...t,
          area: local.area,
          type: local.type,
          category: local.category,
          localClassified: true,
          originalIdx: idx
        };
      }
      return {
        ...t,
        area: "Utgift",
        type: "Övrigt",
        category: "Annat",
        localClassified: false,
        originalIdx: idx
      };
    });

    const unclassified = classifiedList.filter(t => !t.localClassified);

    // 3. Forward Remaining Items in Batches to Gemini
    if (unclassified.length > 0) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const BATCH_SIZE = 50;
      const batchedClassifications: CategorizedItem[] = [];

      for (let i = 0; i < unclassified.length; i += BATCH_SIZE) {
        const batch = unclassified.slice(i, i + BATCH_SIZE);
        
        // Build taxonomy prompt
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
${JSON.stringify(batch.map((t) => ({ id: t.originalIdx, description: t.description, amount: t.amount })), null, 2)}

Output JSON ONLY! Return an array of objects with the exact schema:
[ { "id": number, "area": string, "type": string, "category": string } ]
Make sure area is one of "Utgift", "Inkomst", "Överföring".
If an amount is positive, it's likely an "Inkomst" or "Överföring". If an amount is negative, it's an "Utgift" or "Överföring". Use your best judgement based on the Swedish description.
Do not wrap the JSON in markdown blocks like \`\`\`json, just return raw JSON string.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();

        try {
          const parsed = JSON.parse(cleanedText) as CategorizedItem[];
          batchedClassifications.push(...parsed);
        } catch {
          console.error("Failed to parse Gemini output:", cleanedText);
          throw new Error("AI returned invalid JSON");
        }
      }

      // Merge batched classifications
      unclassified.forEach(tx => {
        const cat = batchedClassifications.find(c => c.id === tx.originalIdx);
        tx.area = cat ? cat.area : "Utgift";
        tx.type = cat ? cat.type : "Övrigt";
        tx.category = cat ? cat.category : "Annat";
      });
    }

    // Format output
    const finalTransactions = classifiedList.map(t => ({
      date: t.date,
      description: t.description,
      amount: t.amount,
      area: t.area,
      type: t.type,
      category: t.category
    }));

    return NextResponse.json({ transactions: finalTransactions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("LLM Categorization error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
