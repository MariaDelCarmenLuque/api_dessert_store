import faker from '@faker-js/faker';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category, Dessert } from '@prisma/client';
import { AuthService } from '../../auth/service/auth.service';
import { CategoryFactory } from '../../categories/factories/category.factory';
import { PrismaService } from '../../prisma.service';
import { DessertFactory } from '../factories/dessert.factory';
import { CreateDessertDto } from '../dtos/request/create-dessert.dto';
import { DessertsService } from './desserts.service';
import { FilesService } from '../../files/service/files.service';
import { ConfigService } from '@nestjs/config';

jest.spyOn(console, 'error').mockImplementation(jest.fn());

describe('DessertsService', () => {
  let dessertService: DessertsService;
  let prisma: PrismaService;
  let dessertFactory: DessertFactory;
  let categoryFactory: CategoryFactory;
  let dessertDto: CreateDessertDto;
  let categories: Category[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DessertsService,
        PrismaService,
        AuthService,
        FilesService,
        ConfigService,
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    dessertService = module.get<DessertsService>(DessertsService);

    dessertFactory = new DessertFactory(prisma);
    categoryFactory = new CategoryFactory(prisma);

    categories = await categoryFactory.makeMany(5);
  });

  beforeEach(() => {
    dessertDto = {
      name: faker.datatype.string(40),
      description: faker.datatype.string(255),
      price: faker.datatype.float(),
      stock: faker.datatype.number(),
      categoryId: categories[1].id,
    };
  });

  afterAll(async () => {
    await prisma.clearDB();
    await prisma.$disconnect();
  });

  describe('findOne', () => {
    beforeAll(async () => {
      jest.mock('jsonwebtoken', () => ({
        sign: jest.fn().mockImplementation(() => 'my.jwt.token'),
      }));
    });

    it('should return dessert by Id', async () => {
      const createDessert = await dessertFactory.make({
        category: {
          connect: { id: categories[2].id },
        },
      });
      const received = await dessertService.findOne(createDessert.id);
      expect(received).toHaveProperty('name', createDessert.name);
      expect(received).toHaveProperty('description', createDessert.description);
      expect(received).toHaveProperty('price', createDessert.price);
      expect(received).toHaveProperty('stock', createDessert.stock);
    });
    it('should throw a error if dessert doesnt found', async () => {
      const findDessert = dessertService.findOne(1000);
      await expect(findDessert).rejects.toThrow(
        new NotFoundException('No Dessert found'),
      );
    });
  });

  describe('create', () => {
    beforeAll(async () => {
      jest.mock('jsonwebtoken', () => ({
        sign: jest.fn().mockImplementation(() => 'my.jwt.token'),
      }));
    });

    it('should create a new dessert and return a dessert properties', async () => {
      const received = await dessertService.create(dessertDto);
      expect(received).toHaveProperty('name', dessertDto.name);
      expect(received).toHaveProperty('description', dessertDto.description);
      expect(received).toHaveProperty('price', dessertDto.price);
      expect(received).toHaveProperty('stock', dessertDto.stock);
    });
    it("should throw a error if dessert's category doesn't exist ", async () => {
      const received = dessertService.create({
        ...dessertDto,
        categoryId: faker.datatype.number(),
      });
      await expect(received).rejects.toThrow(
        new NotFoundException('Category not found'),
      );
    });
  });
  describe('updateDessert', () => {
    let createDessert: Dessert;
    beforeEach(async () => {
      createDessert = await dessertFactory.make({
        category: {
          connect: {
            id: categories[2].id,
          },
        },
      });
    });
    it('should update and return a dessert properties', async () => {
      const received = await dessertService.updateDessert(createDessert.id, {
        ...dessertDto,
      });
      expect(received).toHaveProperty('name', dessertDto.name);
      expect(received).toHaveProperty('description', dessertDto.description);
      expect(received).toHaveProperty('price', dessertDto.price);
      expect(received).toHaveProperty('stock', dessertDto.stock);
    });
    it('should throw a error if dessert not found', async () => {
      const id = faker.datatype.number();
      await expect(
        dessertService.updateDessert(id, { ...dessertDto }),
      ).rejects.toThrow(new NotFoundException(`No Dessert found`));
    });
    it('should throw a error if dessert is deleted', async () => {
      const received = await dessertFactory.make({
        deletedAt: new Date(),
        category: {
          connect: {
            id: categories[2].id,
          },
        },
      });
      await expect(
        dessertService.updateDessert(received.id, {
          ...dessertDto,
        }),
      ).rejects.toThrow(new BadRequestException('Dessert is deleted '));
    });
    it('should throw a error if status dessert is disable', async () => {
      const received = await dessertFactory.make({
        status: false,
        category: {
          connect: {
            id: categories[2].id,
          },
        },
      });
      await expect(
        dessertService.updateDessert(received.id, {
          ...dessertDto,
        }),
      ).rejects.toThrow(new UnauthorizedException('Dessert is disable '));
    });
  });
  describe('deleteDessert', () => {
    let createDessert: Dessert;
    beforeEach(async () => {
      createDessert = await dessertFactory.make({
        category: {
          connect: {
            id: categories[2].id,
          },
        },
      });
    });
    it('should throw a error if dessert not found', async () => {
      const id = faker.datatype.number();
      await expect(dessertService.deleteDessert(id)).rejects.toThrow(
        new NotFoundException(`No Dessert found`),
      );
    });
    it('should throw a error if dessert is deleted', async () => {
      const received = await dessertFactory.make({
        deletedAt: new Date(),
        category: {
          connect: {
            id: categories[2].id,
          },
        },
      });
      await expect(dessertService.deleteDessert(received.id)).resolves.toThrow(
        new BadRequestException('Dessert is deleted'),
      );
    });
    it('should delete dessert successfully', async () => {
      await expect(
        dessertService.deleteDessert(createDessert.id),
      ).resolves.toEqual({
        message: 'Dessert deleted sucessfully',
        status: HttpStatus.OK,
      });
    });
  });
  describe('updateStatus', () => {
    it('should throw a error if dessert not found', async () => {
      const id = faker.datatype.number();
      await expect(dessertService.updateStatus(id)).rejects.toThrow(
        new NotFoundException(`No Dessert found`),
      );
    });
    it('should throw a error if dessert is deleted', async () => {
      const received = await dessertFactory.make({
        deletedAt: new Date(),
        category: {
          connect: {
            id: categories[2].id,
          },
        },
      });
      await expect(dessertService.updateStatus(received.id)).rejects.toThrow(
        new BadRequestException('Dessert is deleted'),
      );
    });
    it('should update status as ACTIVE when dessert status is DISABLE', async () => {
      const dessert = await dessertFactory.make({
        status: false,
        category: {
          connect: {
            id: categories[2].id,
          },
        },
      });
      const received = await dessertService.updateStatus(dessert.id);
      expect(received).toHaveProperty('status', true);
    });
    it('should update status as DISABLE when dessert status is ACTIVE', async () => {
      const dessert = await dessertFactory.make({
        status: true,
        category: {
          connect: {
            id: categories[2].id,
          },
        },
      });
      const received = await dessertService.updateStatus(dessert.id);
      expect(received).toHaveProperty('status', false);
    });
  });
});
