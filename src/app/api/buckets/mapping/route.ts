import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get unique descriptions from balances
    const uniqueBalanceDescriptions = await prisma.balance.findMany({
      select: { description: true },
      distinct: ['description'],
      where: { description: { not: null } }
    });

    // Get current mappings
    const mappings = await prisma.bucketMapping.findMany();

    const categories = uniqueBalanceDescriptions
      .map(c => c.description as string)
      .filter(Boolean);

    return NextResponse.json({ categories, mappings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { mappings } = await req.json();

    // Mapping is an array of { balanceDescription, bucket }
    // Using simple loop and upserts
    for (const m of mappings) {
      await prisma.bucketMapping.upsert({
        where: { balanceDescription: m.balanceDescription },
        update: { bucket: m.bucket },
        create: { balanceDescription: m.balanceDescription, bucket: m.bucket }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
