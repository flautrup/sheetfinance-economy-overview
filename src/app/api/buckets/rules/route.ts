import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { defaultRules } from "@/lib/defaultRules";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let rules = await prisma.preClassificationRule.findMany({
      orderBy: { keyword: "asc" }
    });

    if (rules.length === 0) {
      await prisma.preClassificationRule.createMany({
        data: defaultRules
      });
      rules = await prisma.preClassificationRule.findMany({
        orderBy: { keyword: "asc" }
      });
    }

    return NextResponse.json({ rules });
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

    const { keyword, area, type, category } = await req.json();
    if (!keyword || !area || !type || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rule = await prisma.preClassificationRule.upsert({
      where: { keyword: keyword.trim().toLowerCase() },
      update: {
        area: area.trim(),
        type: type.trim(),
        category: category.trim()
      },
      create: {
        keyword: keyword.trim().toLowerCase(),
        area: area.trim(),
        type: type.trim(),
        category: category.trim()
      }
    });

    return NextResponse.json({ success: true, rule });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing rule ID" }, { status: 400 });
    }

    await prisma.preClassificationRule.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
