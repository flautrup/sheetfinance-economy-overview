import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { preClassify } from "@/lib/preClassifier";
import { prisma } from "@/lib/prisma";

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

    // Load pre-classification rules from database
    let rules = await prisma.preClassificationRule.findMany();
    if (rules.length === 0) {
      const defaultRules = [
        { keyword: "ica", area: "Utgift", type: "Mat & dryck", category: "Livsmedel" },
        { keyword: "netflix", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
        { keyword: "spotify", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
        { keyword: "lön", area: "Inkomst", type: "Inkomst", category: "Lön" },
        { keyword: "swish", area: "Överföring", type: "Överföring", category: "Sparande" },
      ];
      await prisma.preClassificationRule.createMany({
        data: defaultRules
      });
      rules = await prisma.preClassificationRule.findMany();
    }

    // Load Category Taxonomy nodes from database to construct dynamic prompt
    let taxonomyNodes = await prisma.taxonomyNode.findMany();
    if (taxonomyNodes.length === 0) {
      const { defaultTaxonomy } = await import("@/lib/defaultTaxonomy");
      await prisma.taxonomyNode.createMany({
        data: defaultTaxonomy
      });
      taxonomyNodes = await prisma.taxonomyNode.findMany();
    }

    const taxMap: Record<string, Record<string, string[]>> = {};
    taxonomyNodes.forEach((node) => {
      if (!taxMap[node.area]) taxMap[node.area] = {};
      if (!taxMap[node.area][node.type]) taxMap[node.area][node.type] = [];
      if (node.category && !taxMap[node.area][node.type].includes(node.category)) {
        taxMap[node.area][node.type].push(node.category);
      }
    });

    let taxonomyString = "";
    Object.keys(taxMap).forEach((area) => {
      taxonomyString += `\nArea: ${area}\n`;
      Object.keys(taxMap[area]).forEach((type) => {
        taxonomyString += `${area} -> ${type} -> [${taxMap[area][type].join(", ")}]\n`;
      });
    });

    // 2. Local Pre-classification Lookup
    const classifiedList = transactions.map((t: RawTransaction, idx: number) => {
      const local = preClassify(t.description, rules);
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

      // Fetch top user corrections for dynamic few-shot learning
      const userCorrections = await prisma.userCorrection.findMany({
        orderBy: { usageCount: "desc" },
        take: 20,
      });

      let fewShotExamples = "";
      if (userCorrections.length > 0) {
        fewShotExamples = `\nUser-Verified Examples (Learn from these preferred Swedish classifications):\n` +
          userCorrections
            .map(c => `- "${c.description}" -> Area: "${c.correctedArea}", Type: "${c.correctedType}", Category: "${c.correctedCategory}"`)
            .join("\n") + "\n";
      }

      const BATCH_SIZE = 50;
      const batchedClassifications: CategorizedItem[] = [];

      for (let i = 0; i < unclassified.length; i += BATCH_SIZE) {
        const batch = unclassified.slice(i, i + BATCH_SIZE);
        
        // Build taxonomy prompt with dynamic few-shot guidance
        const prompt = `
You are a highly accurate financial transaction categorizer. You must strictly use ONLY the following taxonomy (Area -> Type -> Category/Subtype) to categorize the provided transactions based on their descriptions. Do not invent categories.

Taxonomy:
${taxonomyString}
${fewShotExamples}
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
