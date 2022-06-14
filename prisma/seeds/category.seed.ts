import { Category } from '@prisma/client';

export async function categorySeed(prisma): Promise<Category[]> {
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Cupcakes' },
      { name: 'Cakes' },
      { name: 'Cheesecakes' },
      { name: 'Macaroons' },
    ],
  });
  return categories;
}
