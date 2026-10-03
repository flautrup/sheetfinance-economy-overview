import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const corrections = await prisma.userCorrection.findMany({
      orderBy: { usageCount: "desc" },
      take: 50,
    });

    return NextResponse.json({ corrections });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { corrections } = await req.json();
    if (!corrections || !Array.isArray(corrections)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    let saved = 0;
    for (const c of corrections) {
      if (!c.description || !c.area || !c.type || !c.category) continue;

      const desc = String(c.description).trim();
      if (!desc) continue;

      await prisma.userCorrection.upsert({
        where: { description: desc },
        update: {
          correctedArea: String(c.area).trim(),
          correctedType: String(c.type).trim(),
          correctedCategory: String(c.category).trim(),
          usageCount: { increment: 1 },
        },
        create: {
          description: desc,
          correctedArea: String(c.area).trim(),
          correctedType: String(c.type).trim(),
          correctedCategory: String(c.category).trim(),
          usageCount: 1,
        },
      });
      saved++;
    }

    return NextResponse.json({ success: true, count: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Save user corrections error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
