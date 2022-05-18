import faker from '@faker-js/faker';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AbstractFactory } from 'src/utils/factories/abstract.factory';

type CategoryInput = Partial<Prisma.CategoryCreateInput>;

export class CategoryFactory extends AbstractFactory<Category> {
  constructor(protected prisma: PrismaService) {
    super();
  }

  async make(input: CategoryInput = {}): Promise<Category> {
    const dessert = await this.prisma.category.create({
      data: {
        ...input,
        name: input.name ?? faker.datatype.string(40),
      },
    });
    return dessert;
  }

  makeMany(factorial: number, input: CategoryInput = {}): Promise<Category[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
