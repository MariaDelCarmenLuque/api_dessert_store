import faker from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';
import { AuthService } from '../../auth/service/auth.service';
import { CategoryFactory } from '../../categories/factories/category.factory';
import { PrismaService } from '../../prisma.service';
import { DessertFactory } from '../factories/dessert.factory';
import { CreateDessertDto } from '../models/create-dessert.dto';

import { DessertsService } from './desserts.service';

jest.spyOn(console, 'error').mockImplementation(jest.fn());

describe('DessertsService', () => {
  let serviceDessert: DessertsService;
  let prisma: PrismaService;

  let dessertFactory: DessertFactory;
  let categoryFactory: CategoryFactory;

  let categories: Category[];
  let dessert: CreateDessertDto;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DessertsService, PrismaService, AuthService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    serviceDessert = module.get<DessertsService>(DessertsService);

    dessertFactory = new DessertFactory(prisma);
    categoryFactory = new CategoryFactory(prisma);

    categories = await categoryFactory.makeMany(5);
  });

  beforeEach(() => {
    dessert = {
      name: faker.datatype.string(40),
      description: faker.datatype.string(255),
      price: faker.datatype.float(),
      stock: faker.datatype.number(),
      categoryId: faker.datatype.number(),
    };
  });

  afterAll(async () => {
    await prisma.clearDB();
    await prisma.$disconnect();
  });

  describe('findOne', () => {
    let category: Category;
    beforeAll(async () => {
      // jest.mock('jsonwebtoken', () => ({
      //   sign: jest.fn().mockImplementation(() => 'my.jwt.token'),
      // }));
      category = await categoryFactory.make();
    });

    it('should return dessert by Id category', async () => {
      const createDessert = await dessertFactory.make({
        category: {
          connect: { id: category.id },
        },
      });
      const result = await serviceDessert.findOne(createDessert.id);
      expect(result).toHaveProperty('name', createDessert.name);
      expect(result).toHaveProperty('description', createDessert.description);
      expect(result).toHaveProperty('price', createDessert.price);
      expect(result).toHaveProperty('stock', createDessert.stock);
    });
    it("should throw a error if product doesn't exist", async () => {
      expect(await serviceDessert.findOne(1000)).toEqual({});
    });
  });
});
