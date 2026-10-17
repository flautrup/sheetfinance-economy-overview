import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { preClassify } from "@/lib/preClassifier";
import { prisma } from "@/lib/prisma";
import { computeTxHash } from "@/lib/txHash";
import { normalizeArea } from "@/lib/area";
import { cleanDescription, getMerchantKeyword } from "@/lib/cleanDescription";

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
  account?: string;
  reference?: string;
  saldo?: number;
}

/**
 * Amount-sign prefilter: a negative amount can never be "Inkomst" and a positive
 * amount can never be "Utgift". "Överföring" (transfers/savings) is possible for
 * both signs, so it is always kept as an option.
 */
function areaAllowed(area: string | null | undefined, amount: number): boolean {
  const a = normalizeArea(area);
  if (amount < 0) return a !== "Inkomst";
  if (amount > 0) return a !== "Utgift";
  return true;
}

function defaultForAmount(amount: number) {
  return amount > 0
    ? { area: "Inkomst", type: "Inkomst", category: "Övrig inkomst" }
    : { area: "Utgift", type: "Övrigt", category: "Annat" };
}

function resolveTaxonomyMatch(
  area: string | null | undefined,
  fieldA: string | null | undefined,
  fieldB: string | null | undefined,
  taxMap: Record<string, Record<string, string[]>>
): { area: string; type: string; category: string } | null {
  const normArea = normalizeArea(area);
  if (!normArea || !taxMap[normArea]) return null;

  const a = (fieldA || "").trim();
  const b = (fieldB || "").trim();

  const areaTypes = taxMap[normArea];
  const typeKeys = Object.keys(areaTypes);

  const findTypeKey = (candidate: string) => {
    const candLower = candidate.toLowerCase();
    return typeKeys.find((k) => {
      const kLower = k.toLowerCase();
      if (kLower === candLower) return true;
      if (candLower === "försäkringar" && kLower === "försäkring") return true;
      if (candLower === "mat & dryck" && kLower === "mat & dryck") return true;
      if (candLower === "lån" && kLower === "lån") return true;
      if (candLower === "sparande" && normArea === "Överföring") return true;
      return false;
    });
  };

  let matchedType = findTypeKey(a);
  if (matchedType) {
    const cats = areaTypes[matchedType] || [];
    const matchedCat = cats.find((c) => c.toLowerCase() === b.toLowerCase()) || cats[0] || b || "Annat";
    return { area: normArea, type: matchedType, category: matchedCat };
  }

  matchedType = findTypeKey(b);
  if (matchedType) {
    const cats = areaTypes[matchedType] || [];
    const matchedCat = cats.find((c) => c.toLowerCase() === a.toLowerCase()) || cats[0] || a || "Annat";
    return { area: normArea, type: matchedType, category: matchedCat };
  }

  for (const tKey of typeKeys) {
    const cats = areaTypes[tKey] || [];
    const foundCat = cats.find(
      (c) => c.toLowerCase() === a.toLowerCase() || c.toLowerCase() === b.toLowerCase()
    );
    if (foundCat) {
      return { area: normArea, type: tKey, category: foundCat };
    }
  }

  if (typeKeys.length > 0) {
    const fallbackType = typeKeys[0];
    const fallbackCats = areaTypes[fallbackType] || [];
    return { area: normArea, type: fallbackType, category: fallbackCats[0] || "Annat" };
  }

  return null;
}

export async function POST(req: Request) {
  try {
    // 1. Verify Session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactions, accountOwner = "", skipExisting = true } = await req.json();
    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (transactions.length === 0) {
      return NextResponse.json({
        transactions: [],
        skippedCount: 0,
        stats: {
          totalInFile: 0,
          skippedDuplicates: 0,
          newTransactions: 0,
          matchedByCorrections: 0,
          matchedByRules: 0,
          matchedByHistory: 0,
          matchedByAi: 0,
        }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Load Category Taxonomy nodes from database once
    let taxonomyNodes = await prisma.taxonomyNode.findMany();
    if (taxonomyNodes.length === 0) {
      const { defaultTaxonomy } = await import("@/lib/defaultTaxonomy");
      await prisma.taxonomyNode.createMany({ data: defaultTaxonomy });
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

    // 2. Hash and Deduplicate Against Existing Transactions
    const occurrenceTracker: Record<string, number> = {};
    const preparedCandidates = transactions.map((t: RawTransaction, idx: number) => {
      const parsedDate = new Date(t.date);
      const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
      const dateStr = validDate.toISOString().slice(0, 10);
      const descStr = String(t.description || "").trim();
      const accStr = (t.account || accountOwner || "").trim().toLowerCase();
      const amountVal = Number(t.amount);

      const hash = computeTxHash(validDate, descStr, occurrenceTracker);

      return {
        ...t,
        originalIdx: idx,
        date: validDate,
        dateStr,
        descStr,
        accStr,
        amount: amountVal,
        hash,
      };
    });

    const existingHashSet = new Set<string>();

    if (skipExisting) {
      // Direct hash lookup (hash = date + description + occurrence index)
      const candidateHashes = preparedCandidates.map(c => c.hash);
      const existingByHash = await prisma.transaction.findMany({
        where: { hash: { in: candidateHashes } },
        select: { hash: true }
      });
      existingByHash.forEach(r => {
        if (r.hash) existingHashSet.add(r.hash);
      });
    }

    const toProcess = skipExisting
      ? preparedCandidates.filter(c => !existingHashSet.has(c.hash))
      : preparedCandidates;

    const skippedDuplicates = preparedCandidates.length - toProcess.length;

    if (toProcess.length === 0) {
      return NextResponse.json({
        transactions: [],
        skippedCount: skippedDuplicates,
        stats: {
          totalInFile: transactions.length,
          skippedDuplicates,
          newTransactions: 0,
          matchedByCorrections: 0,
          matchedByRules: 0,
          matchedByHistory: 0,
          matchedByAi: 0,
        }
      });
    }

    // 3. User Corrections Lookup
    const userCorrections = await prisma.userCorrection.findMany({
      orderBy: { usageCount: "desc" },
    });
    const correctionsMap = new Map<string, { area: string; type: string; category: string }>();
    userCorrections.forEach(c => {
      if (c.description) {
        const resolved = resolveTaxonomyMatch(c.correctedArea, c.correctedType, c.correctedCategory, taxMap);
        if (resolved) {
          correctionsMap.set(c.description.trim().toLowerCase(), resolved);
        }
      }
    });

    // 4. Keyword Rules Lookup
    let rules = await prisma.preClassificationRule.findMany();
    if (rules.length === 0) {
      const defaultRules = [
        { keyword: "ica", area: "Utgift", type: "Mat & dryck", category: "Livsmedel" },
        { keyword: "netflix", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
        { keyword: "spotify", area: "Utgift", type: "Nöjen/Shopping", category: "Media/Bok/Kultur" },
        { keyword: "lön", area: "Inkomst", type: "Inkomst", category: "Lön" },
        { keyword: "swish", area: "Överföring", type: "Överföring", category: "Sparande" },
      ];
      await prisma.preClassificationRule.createMany({ data: defaultRules });
      rules = await prisma.preClassificationRule.findMany();
    }

    // 5. Historical Transactions Lookup
    // 5A. Exact description lookup
    const descriptionsToLookup = Array.from(new Set(
      toProcess
        .filter(t => !correctionsMap.has(t.descStr.toLowerCase()) && !preClassify(t.descStr, rules))
        .map(t => t.descStr)
    )).filter(d => d.length > 0);

    const exactHistoryMap = new Map<string, { area: string; type: string; category: string }>();

    if (descriptionsToLookup.length > 0) {
      const pastTxs = await prisma.transaction.findMany({
        where: {
          description: { in: descriptionsToLookup },
          category: { not: null },
          area: { not: null },
          AND: [
            { category: { not: "" } },
          ]
        },
        select: {
          description: true,
          area: true,
          type: true,
          category: true,
        },
        orderBy: { date: "desc" },
      });

      for (const pt of pastTxs) {
        const key = (pt.description || "").trim().toLowerCase();
        if (!exactHistoryMap.has(key) && pt.area && (pt.category || pt.type)) {
          const resolved = resolveTaxonomyMatch(pt.area, pt.type, pt.category, taxMap);
          if (resolved) {
            exactHistoryMap.set(key, resolved);
          }
        }
      }
    }

    // 5B. Normalized & Cleaned merchant lookup for transactions not matched exactly
    const cleanedHistoryMap = new Map<string, { area: string; type: string; category: string }>();
    const remainingToLookup = toProcess.filter(t => {
      const dKey = t.descStr.toLowerCase();
      return !correctionsMap.has(dKey) && !preClassify(t.descStr, rules) && !exactHistoryMap.has(dKey);
    });

    if (remainingToLookup.length > 0) {
      const merchantSearchTerms = Array.from(new Set(
        remainingToLookup.map(t => {
          const cleaned = cleanDescription(t.descStr);
          return {
            cleanedLower: cleaned.toLowerCase(),
            cleaned,
            merchant: getMerchantKeyword(cleaned),
            merchantLower: getMerchantKeyword(cleaned).toLowerCase(),
          };
        }).filter(m => m.merchant.length >= 3)
      ));

      if (merchantSearchTerms.length > 0) {
        const pastMerchantTxs = await prisma.transaction.findMany({
          where: {
            OR: merchantSearchTerms.map(m => ({
              description: { contains: m.merchant }
            })),
            category: { not: null },
            area: { not: null },
            AND: [{ category: { not: "" } }]
          },
          select: {
            description: true,
            area: true,
            type: true,
            category: true,
          },
          orderBy: { date: "desc" },
          take: 500,
        });

        for (const pt of pastMerchantTxs) {
          const ptDesc = (pt.description || "").toLowerCase();
          const resolved = resolveTaxonomyMatch(pt.area, pt.type, pt.category, taxMap);
          if (!resolved) continue;

          for (const m of merchantSearchTerms) {
            if (ptDesc.includes(m.cleanedLower) || ptDesc.includes(m.merchantLower)) {
              if (!cleanedHistoryMap.has(m.cleanedLower)) {
                cleanedHistoryMap.set(m.cleanedLower, resolved);
              }
              if (!cleanedHistoryMap.has(m.merchantLower)) {
                cleanedHistoryMap.set(m.merchantLower, resolved);
              }
            }
          }
        }
      }
    }

    // 6. Match locally first (Corrections -> Rules -> Exact/Cleaned History)
    let matchedByCorrections = 0;
    let matchedByRules = 0;
    let matchedByHistory = 0;
    let matchedByAi = 0;

    const classifiedList = toProcess.map(t => {
      const dKey = t.descStr.toLowerCase();

      if (correctionsMap.has(dKey) && areaAllowed(correctionsMap.get(dKey)!.area, t.amount)) {
        matchedByCorrections++;
        const c = correctionsMap.get(dKey)!;
        return {
          ...t,
          area: c.area,
          type: c.type,
          category: c.category,
          matchSource: "correction" as const,
          isClassified: true,
        };
      }

      const ruleMatch = preClassify(t.descStr, rules);
      if (ruleMatch && areaAllowed(ruleMatch.area, t.amount)) {
        const resolved = resolveTaxonomyMatch(ruleMatch.area, ruleMatch.type, ruleMatch.category, taxMap);
        if (resolved && areaAllowed(resolved.area, t.amount)) {
          matchedByRules++;
          return {
            ...t,
            area: resolved.area,
            type: resolved.type,
            category: resolved.category,
            matchSource: "rule" as const,
            isClassified: true,
          };
        }
      }

      const cleanedKey = cleanDescription(t.descStr).toLowerCase();
      const merchantKey = getMerchantKeyword(cleanDescription(t.descStr)).toLowerCase();
      const histMatch = exactHistoryMap.get(dKey) || cleanedHistoryMap.get(cleanedKey) || cleanedHistoryMap.get(merchantKey);

      if (histMatch && areaAllowed(histMatch.area, t.amount)) {
        matchedByHistory++;
        return {
          ...t,
          area: histMatch.area,
          type: histMatch.type,
          category: histMatch.category,
          matchSource: "history" as const,
          isClassified: true,
        };
      }

      return {
        ...t,
        ...defaultForAmount(t.amount),
        matchSource: "ai" as const,
        isClassified: false,
      };
    });

    const unclassified = classifiedList.filter(t => !t.isClassified);

    // 7. Only query Gemini AI if there are truly unclassified new rows
    if (unclassified.length > 0) {
      if (!apiKey) {
        console.warn("GEMINI_API_KEY missing in .env.local; remaining rows set to default category");
      } else {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Amount-sign prefilter: negative -> Utgift/Överföring, positive -> Inkomst/Överföring.
        // Each group only sees the part of the taxonomy that is possible for it.
        const groups = [
          { sign: "negativa", items: unclassified.filter((t) => t.amount < 0), areas: ["Utgift", "Överföring"] },
          { sign: "positiva", items: unclassified.filter((t) => t.amount > 0), areas: ["Inkomst", "Överföring"] },
          { sign: "noll", items: unclassified.filter((t) => t.amount === 0), areas: ["Utgift", "Inkomst", "Överföring"] },
        ];

        const BATCH_SIZE = 50;
        const batchedClassifications: CategorizedItem[] = [];

        for (const group of groups) {
          if (group.items.length === 0) continue;

          let taxonomyString = "";
          Object.keys(taxMap)
            .filter((area) => group.areas.includes(normalizeArea(area)))
            .forEach((area) => {
              taxonomyString += `\nArea: ${area}\n`;
              Object.keys(taxMap[area]).forEach((type) => {
                taxonomyString += `${area} -> ${type} -> [${taxMap[area][type].join(", ")}]\n`;
              });
            });

          let fewShotExamples = "";
          const groupCorrections = userCorrections
            .filter((c) => group.areas.includes(normalizeArea(c.correctedArea)))
            .slice(0, 20);
          if (groupCorrections.length > 0) {
            fewShotExamples = `\nUser-Verified Examples (Learn from these preferred Swedish classifications):\n` +
              groupCorrections
                .map(c => `- "${c.description}" -> Area: "${c.correctedArea}", Type: "${c.correctedType}", Category: "${c.correctedCategory}"`)
                .join("\n") + "\n";
          }

          const allowedAreasText = group.areas.map((a) => `"${a}"`).join(", ");

          for (let i = 0; i < group.items.length; i += BATCH_SIZE) {
            const batch = group.items.slice(i, i + BATCH_SIZE);

            const prompt = `
You are a highly accurate financial transaction categorizer. You must strictly use ONLY the following taxonomy (Area -> Type -> Category/Subtype) to categorize the provided transactions based on their descriptions. Do not invent categories.

All transactions below have ${group.sign} belopp, so the only allowed areas are: ${allowedAreasText}.

Taxonomy:
${taxonomyString}
${fewShotExamples}
Input Transactions:
${JSON.stringify(batch.map((t) => ({ id: t.originalIdx, description: t.descStr, amount: t.amount })), null, 2)}

Output JSON ONLY! Return an array of objects with the exact schema:
[ { "id": number, "area": string, "type": string, "category": string } ]
Make sure area is one of ${allowedAreasText}. Use your best judgement based on the Swedish description.
Do not wrap the JSON in markdown blocks like \`\`\`json, just return raw JSON string.
`;

            try {
              const result = await model.generateContent(prompt);
              const responseText = result.response.text().trim();
              const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
              const parsed = JSON.parse(cleanedText) as CategorizedItem[];
              batchedClassifications.push(...parsed);
            } catch (batchErr) {
              console.error("Gemini batch categorization error:", batchErr);
            }
          }
        }

        // Apply Gemini classifications. Reject anything that contradicts the amount sign
        // or is not in the taxonomy; those rows keep the sign-based default.
        unclassified.forEach(tx => {
          const cat = batchedClassifications.find(c => c.id === tx.originalIdx);
          if (!cat) return;
          const resolved = resolveTaxonomyMatch(cat.area, cat.type, cat.category, taxMap);
          if (resolved && areaAllowed(resolved.area, tx.amount)) {
            tx.area = resolved.area;
            tx.type = resolved.type;
            tx.category = resolved.category;
            matchedByAi++;
          }
        });
      }
    }

    // Format output
    const finalTransactions = classifiedList.map(t => ({
      date: t.dateStr,
      description: t.descStr,
      amount: t.amount,
      area: normalizeArea(t.area),
      type: t.type,
      category: t.category,
      matchSource: t.matchSource,
      hash: t.hash,
    }));

    return NextResponse.json({
      transactions: finalTransactions,
      skippedCount: skippedDuplicates,
      stats: {
        totalInFile: transactions.length,
        skippedDuplicates,
        newTransactions: finalTransactions.length,
        matchedByCorrections,
        matchedByRules,
        matchedByHistory,
        matchedByAi,
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Categorization error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

