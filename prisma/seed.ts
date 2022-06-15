import { PrismaClient } from '@prisma/client';
import { categorySeed, dessertSeed, userSeed } from './seeds';

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    userSeed(prisma),
    categorySeed(prisma),
    dessertSeed(prisma),
  ]);
}
main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
