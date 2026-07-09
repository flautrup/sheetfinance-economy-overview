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

    const transactionCount = await prisma.transaction.count();
    const balanceCount = await prisma.balance.count();
    const mappingCount = await prisma.bucketMapping.count();
    const scenarioCount = await prisma.bucketScenario.count();

    return NextResponse.json({
      transactionCount,
      balanceCount,
      mappingCount,
      scenarioCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Wipe transactions and balances
    const deleteTx = prisma.transaction.deleteMany({});
    const deleteBal = prisma.balance.deleteMany({});
    const deleteMappings = prisma.bucketMapping.deleteMany({});
    const deleteScenarios = prisma.bucketScenario.deleteMany({});

    await prisma.$transaction([deleteTx, deleteBal, deleteMappings, deleteScenarios]);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
