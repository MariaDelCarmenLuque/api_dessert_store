import { PrismaClient } from '@prisma/client';
import { categorySeed } from './seeds/category.seed';

const prisma = new PrismaClient();

async function main() {
  await Promise.all([await categorySeed(prisma)]);
}
main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
