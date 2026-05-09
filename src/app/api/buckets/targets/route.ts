import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const scenarios = await prisma.bucketScenario.findMany();
    const targets: Record<string, number | null> = {};
    scenarios.forEach((s) => {
      targets[s.bucket] = s.targetAmount;
    });
    return NextResponse.json({ targets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { targets } = await req.json(); // { "BUFFER": 50000, "PRESERVE": 1000000 }
    
    for (const [bucket, amount] of Object.entries(targets)) {
      const targetAmount = amount === "" || amount === null ? null : Number(amount);
      await prisma.bucketScenario.upsert({
        where: { bucket },
        update: { targetAmount },
        create: {
          bucket,
          targetAmount,
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
