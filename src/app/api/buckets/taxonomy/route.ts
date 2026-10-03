import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { defaultTaxonomy } from "@/lib/defaultTaxonomy";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let nodes = await prisma.taxonomyNode.findMany({
      orderBy: [{ area: "asc" }, { type: "asc" }, { category: "asc" }],
    });

    if (nodes.length === 0) {
      await prisma.taxonomyNode.createMany({
        data: defaultTaxonomy
      });
      nodes = await prisma.taxonomyNode.findMany({
        orderBy: [{ area: "asc" }, { type: "asc" }, { category: "asc" }],
      });
    }

    // Build hierarchical taxonomy object
    const taxonomy: Record<string, Record<string, string[]>> = {};
    nodes.forEach((node) => {
      const area = node.area;
      const type = node.type;
      const cat = node.category;

      if (!taxonomy[area]) taxonomy[area] = {};
      if (!taxonomy[area][type]) taxonomy[area][type] = [];
      if (!taxonomy[area][type].includes(cat)) {
        taxonomy[area][type].push(cat);
      }
    });

    return NextResponse.json({ taxonomy, rawNodes: nodes });
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

    const { area, type, category } = await req.json();
    if (!area || !type || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const node = await prisma.taxonomyNode.create({
      data: {
        area: area.trim(),
        type: type.trim(),
        category: category.trim()
      }
    });

    return NextResponse.json({ success: true, node });
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
      return NextResponse.json({ error: "Missing node ID" }, { status: 400 });
    }

    await prisma.taxonomyNode.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
