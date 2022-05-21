import faker from '@faker-js/faker';
import { Dessert, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AbstractFactory } from '../../utils/factories/abstract.factory';

type DessertInput = Partial<Prisma.DessertCreateInput>;

export class DessertFactory extends AbstractFactory<Dessert> {
  constructor(protected prisma: PrismaService) {
    super();
  }

  async make(input: DessertInput = {}): Promise<Dessert> {
    const dessert = await this.prisma.dessert.create({
      data: {
        ...input,
        name: input.name ?? faker.datatype.string(40),
        description: input.description ?? faker.datatype.string(255),
        price: input.price ?? faker.datatype.float(),
        stock: input.stock ?? faker.datatype.number(),
        category: input.category,
      },
    });
    return dessert;
  }

  makeMany(factorial: number, input: DessertInput = {}): Promise<Dessert[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
