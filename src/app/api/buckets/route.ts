import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // 1. Verify Authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const compareDateParam = searchParams.get('compareDate');

    // Fetch all unique available dates
    const uniqueDatesObj = await prisma.balance.findMany({
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'desc' }
    });
    const availableDates = uniqueDatesObj.map(d => d.date.toISOString());

    const mappings = await prisma.bucketMapping.findMany({
      where: { bucket: { in: ["BUFFER", "PRESERVE", "GROWTH", "PLAY"] } }
    });
    
    const bucketByDesc: Record<string, string> = {};
    mappings.forEach(m => {
      bucketByDesc[m.balanceDescription] = m.bucket;
    });

    const calculateBucketsForDate = async (targetDateString: string | null) => {
      const buckets = { BUFFER: 0, PRESERVE: 0, GROWTH: 0, PLAY: 0 };
      
      let dateQuery: Date | null = null;
      if (targetDateString) {
        dateQuery = new Date(targetDateString);
      } else if (availableDates.length > 0) {
        dateQuery = new Date(availableDates[0]);
      }

      if (dateQuery) {
        const balances = await prisma.balance.findMany({
          where: { date: dateQuery }
        });

        balances.forEach(bal => {
          const desc = bal.description || "";
          const b = bucketByDesc[desc] as keyof typeof buckets;
          if (b) {
            const isDebt = bal.type?.toLowerCase().includes("skuld") || bal.type?.toLowerCase() === "skulder";
            const value = isDebt ? -Math.abs(bal.value) : bal.value;
            buckets[b] += value;
          }
        });
      }
      return buckets;
    };

    const buckets = await calculateBucketsForDate(dateParam);
    const compareBuckets = compareDateParam ? await calculateBucketsForDate(compareDateParam) : null;

    const targetsRes = await prisma.bucketScenario.findMany();
    const targets: Record<string, number | null> = {};
    targetsRes.forEach(t => targets[t.bucket] = t.targetAmount);

    return NextResponse.json({ buckets, compareBuckets, targets, availableDates });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
