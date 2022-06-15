import { PrismaClient } from '@prisma/client';
import { categorySeed } from './seeds/category.seed';
import { dessertSeed } from './seeds/dessert.seed';
import { userSeed } from './seeds/user.seed';

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    await categorySeed(prisma),
    await userSeed(prisma),
    await dessertSeed(prisma),
  ]);
}
main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
