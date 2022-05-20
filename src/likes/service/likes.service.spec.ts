import { Test, TestingModule } from '@nestjs/testing';
import { Category, Dessert, User } from '@prisma/client';
import { CategoryFactory } from '../../categories/factories/category.factory';
import { DessertFactory } from '../../desserts/factories/dessert.factory';
import { UserFactory } from '../../users/factories/user.factory';
import { PrismaService } from '../../prisma.service';
import { LikeFactory } from '../factories/like.factory';
import { LikesService } from './likes.service';
import faker from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';

describe('LikesService', () => {
  let likeService: LikesService;
  let prisma: PrismaService;

  let userFactory: UserFactory;
  let dessertFactory: DessertFactory;
  let categoryFactory: CategoryFactory;
  let likeFactory: LikeFactory;

  let category: Category;
  let dessert: Dessert;
  let createUser: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikesService, PrismaService],
    }).compile();

    likeService = module.get<LikesService>(LikesService);
    prisma = module.get<PrismaService>(PrismaService);
    likeFactory = new LikeFactory(prisma);
    userFactory = new UserFactory(prisma);
    dessertFactory = new DessertFactory(prisma);
    categoryFactory = new CategoryFactory(prisma);

    createUser = await userFactory.make();
    category = await categoryFactory.make();
  });

  beforeEach(async () => {
    dessert = await dessertFactory.make({
      category: {
        connect: {
          id: category.id,
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.clearDB();
    await prisma.$disconnect();
  });
  describe('findLikes', () => {
    it('should return all the created likes in a Dessert', async () => {
      const likes = await likeFactory.makeMany(5, {
        user: { connect: { id: createUser.id } },
        dessert: { connect: { id: dessert.id } },
        isLike: true,
      });
      console.log(likes, dessert, createUser);
      const received = await likeService.findLikes(dessert.id);
      console.log(received);
      expect(received.length).toBe(likes.length);
    });
    it('should throw a error if dessert doesnt found', async () => {
      const received = likeService.findLikes(faker.datatype.number());
      await expect(received).rejects.toThrow(
        new NotFoundException('No Dessert found'),
      );
    });
    it('should return a empty list', async () => {
      const received = await likeService.findLikes(dessert.id);
      expect(received).toEqual([]);
    });
  });
  describe('upsertLike', () => {
    it('should create a like and return a like properties', async () => {
      const received = await likeService.upsertLike(createUser.id, dessert.id, {
        isLike: faker.datatype.boolean(),
      });

      expect(received).toHaveProperty('dessertId', dessert.id);
      expect(received).toHaveProperty('userId', createUser.id);
      expect(received).toHaveProperty('isLike', expect.any(Boolean));
      expect(received).toHaveProperty('createdAt', expect.any(Date));
    });

    it('should update a like and return a like properties', async () => {
      const createLike = await likeFactory.make({
        user: { connect: { id: createUser.id } },
        dessert: { connect: { id: dessert.id } },
        isLike: false,
      });

      const received = await likeService.upsertLike(createUser.id, dessert.id, {
        isLike: true,
      });

      expect(received).toHaveProperty('dessertId', createLike.dessertId);
      expect(received).toHaveProperty('userId', createLike.userId);
      expect(received).toHaveProperty('isLike', true);
      expect(received).toHaveProperty('createdAt', createLike.createdAt);
    });

    it("should return a error if user doesn't exist", async () => {
      await expect(
        likeService.upsertLike(faker.datatype.number(), dessert.id, {
          isLike: faker.datatype.boolean(),
        }),
      ).rejects.toThrow(new NotFoundException('No User found'));
    });

    it("should return a error if desser doesn't exist", async () => {
      await expect(
        likeService.upsertLike(createUser.id, faker.datatype.number(), {
          isLike: faker.datatype.boolean(),
        }),
      ).rejects.toThrow(new NotFoundException('No Dessert found'));
    });
  });
  describe('delete', () => {
    it('should delete a like and return a true', async () => {
      await likeFactory.make({
        user: { connect: { id: createUser.id } },
        dessert: { connect: { id: dessert.id } },
        isLike: false,
      });
      const received = await likeService.delete(createUser.id, dessert.id);
      expect(received).toBe(true);
    });

    it("should return a error if user doesn't exist", async () => {
      await expect(
        likeService.delete(faker.datatype.number(), dessert.id),
      ).rejects.toThrow(new NotFoundException('No User found'));
    });

    it("should return a error if dessert doesn't exist", async () => {
      await expect(
        likeService.delete(createUser.id, faker.datatype.number()),
      ).rejects.toThrow(new NotFoundException('No Dessert found'));
    });
  });
});
