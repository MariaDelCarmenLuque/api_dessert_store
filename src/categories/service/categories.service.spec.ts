import faker from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { CategoryFactory } from '../factories/category.factory';
import { CategoryDto } from '../models/category.dto';
import { CategoriesService } from './categories.service';

jest.spyOn(console, 'error').mockImplementation(jest.fn());

describe('CategoriesService', () => {
  let categoryService: CategoriesService;
  let prisma: PrismaService;

  let categories: Category[];
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, PrismaService],
    }).compile();

    categoryService = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);

    categoryFactory = new CategoryFactory(prisma);
    categories = await categoryFactory.makeMany(5);
  });
  afterAll(async () => {
    await prisma.clearDB();
    await prisma.$disconnect();
  });
  describe('getAll', () => {
    it('should return a list of all user', async () => {
      const received = await categoryService.getAll();
      expect(received.length).toEqual(categories.length);
    });
  });

  describe('findOne', () => {
    it('should return a category find by Id', async () => {
      const received = await categoryService.findOne(categories[1].id);

      expect(received).toHaveProperty('id', categories[1].id);
      expect(received).toHaveProperty('uuid', categories[1].uuid);
      expect(received).toHaveProperty('name', categories[1].name);
      expect(received).toHaveProperty('createdAt', categories[1].createdAt);
      expect(received).toHaveProperty('updatedAt', categories[1].updatedAt);
    });

    it('should throw a error if category doesnt found', async () => {
      const id = faker.datatype.number();
      await expect(categoryService.findOne(id)).rejects.toThrow(
        new NotFoundException(`No Category found`),
      );
    });
  });
  describe('create', () => {
    it('should return a new category ', async () => {
      const data = {
        name: faker.commerce.productName(),
      };
      const received = await categoryService.create(
        plainToClass(CategoryDto, data),
      );
      expect(received).toHaveProperty('name', data.name);
    });
  });
  describe('updateCategory', () => {
    it('should update data category and return category properties  ', async () => {
      const data = {
        name: 'newCategoryName',
      };
      const createCategory = await categoryFactory.make();
      const received = await categoryService.updateCategory(
        createCategory.id,
        plainToClass(CategoryDto, data),
      );
      expect(received).toHaveProperty('name', data.name);
    });

    it('should throw a error if the category doesnt exist', async () => {
      const data = {
        name: 'newCategoryName',
      };
      await expect(
        categoryService.updateCategory(
          faker.datatype.number(),
          plainToClass(CategoryDto, data),
        ),
      ).rejects.toThrow(new NotFoundException('No Category found'));
    });
  });
});
