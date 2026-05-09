const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const areas = await prisma.transaction.findMany({
    select: { area: true },
    distinct: ['area'],
  });
  console.log('AREAS:', JSON.stringify(areas));
}

main().catch(console.error).finally(() => prisma.$disconnect());
