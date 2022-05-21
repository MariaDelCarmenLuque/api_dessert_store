import faker from '@faker-js/faker';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CartItem, Category, Dessert, User } from '@prisma/client';
import { CategoryFactory } from '../../categories/factories/category.factory';
import { DessertFactory } from '../../desserts/factories/dessert.factory';
import { PrismaService } from '../../prisma.service';
import { UserFactory } from '../../users/factories/user.factory';
import { CartItemFactory } from '../factories/cart-item.factory';
import { CartService } from './cart.service';

describe('CartService', () => {
  let cartService: CartService;
  let prisma: PrismaService;

  let userFactory: UserFactory;
  let dessertFactory: DessertFactory;
  let categoryFactory: CategoryFactory;
  let cartItemFactory: CartItemFactory;

  let categories: Category[];
  let desserts: Dessert[];
  let createUser: User;
  const stock = 10;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, PrismaService],
    }).compile();

    cartService = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);
    userFactory = new UserFactory(prisma);
    dessertFactory = new DessertFactory(prisma);
    categoryFactory = new CategoryFactory(prisma);
    cartItemFactory = new CartItemFactory(prisma);

    categories = await categoryFactory.makeMany(5);

    createUser = await userFactory.make();
  });

  beforeEach(async () => {
    desserts = [];
    for (let i = 0; i < 5; i++) {
      const arr = await dessertFactory.makeMany(2, {
        category: {
          connect: {
            id: categories[i].id,
          },
        },
        price: 500,
        stock: stock,
      });
      desserts.push(...arr);
    }
  });
  afterAll(async () => {
    await prisma.clearDB();
    await prisma.$disconnect();
  });

  describe('getItems', () => {
    it('should return a empty list', async () => {
      const received = await cartService.getItems(createUser.id);
      expect(received).toEqual([]);
    });
    it("should return a list of products in user's cart", async () => {
      const cart = await prisma.cart.findUnique({
        where: {
          userId: createUser.id,
        },
      });

      const cartItems: CartItem[] = [];
      for (let i = 0; i < desserts.length; i++) {
        const newcartItem = await cartItemFactory.make({
          cart: {
            connect: {
              id: cart.id,
            },
          },
          dessert: {
            connect: {
              id: desserts[i].id,
            },
          },
          quantity: faker.datatype.number(),
          unitPrice: faker.datatype.float(),
          totalPrice: faker.datatype.float(),
        });
        cartItems.push(newcartItem);
      }

      const received = await cartService.getItems(createUser.id);

      expect(received.length).toEqual(desserts.length);
    });

    it("should throw a error if user doesn't exist", async () => {
      await expect(
        cartService.getItems(faker.datatype.number()),
      ).rejects.toThrow(new NotFoundException('No Cart found'));
    });
  });

  describe('upsert', () => {
    it("should create a cart's item successfully", async () => {
      const received = await cartService.upsertItem(createUser.id, {
        dessertId: desserts[1].id,
        quantity: stock,
      });
      expect(received).toHaveProperty('amount', desserts[1].price * stock);
      expect(received).toHaveProperty('updatedAt');
      expect(received).toHaveProperty('createdAt');
    });

    it("should throw a error if user doesn't exist", async () => {
      await expect(
        cartService.upsertItem(faker.datatype.number(), {
          dessertId: desserts[2].id,
          quantity: stock,
        }),
      ).rejects.toThrow(new NotFoundException('No User found'));
    });

    it("should throw a error if dessert doesn't exist", async () => {
      await expect(
        cartService.upsertItem(createUser.id, {
          dessertId: faker.datatype.number(),
          quantity: stock,
        }),
      ).rejects.toThrow(new NotFoundException('No Dessert found'));
    });

    it('should return a error if dessert is disable', async () => {
      const newDessert = await dessertFactory.make({
        status: 'DISABLE',
        category: { connect: { id: categories[1].id } },
      });

      await expect(
        cartService.upsertItem(createUser.id, {
          dessertId: newDessert.id,
          quantity: 5,
        }),
      ).rejects.toThrow(
        new UnauthorizedException('This dessert has been disable'),
      );
    });
  });
  it("should return a error if quantity is out of dessert's stock ", async () => {
    await expect(
      cartService.upsertItem(createUser.id, {
        dessertId: desserts[1].id,
        quantity: 20,
      }),
    ).rejects.toThrow(
      new BadRequestException('Required quantity not available'),
    );
  });

  describe('delete', () => {
    it('should delete desserts in cart successfully', async () => {
      const cart = await prisma.cart.findFirst({
        where: {
          userId: createUser.id,
        },
      });

      const createDessert = await dessertFactory.make({
        stock,
        category: {
          connect: {
            id: categories[1].id,
          },
        },
      });

      await cartItemFactory.make({
        cart: {
          connect: {
            id: cart.id,
          },
        },
        dessert: {
          connect: {
            id: createDessert.id,
          },
        },
        quantity: faker.datatype.number(),
        unitPrice: faker.datatype.float(),
        totalPrice: faker.datatype.float(),
      });

      expect(await cartService.delete(createUser.id, createDessert.id)).toBe(
        true,
      );
    });

    it("should throw a error if user doesn't exist", async () => {
      await expect(
        cartService.delete(faker.datatype.number(), desserts[2].id),
      ).rejects.toThrow(new NotFoundException('No User found'));
    });

    it("should throw a error if dessert doesn't exist", async () => {
      await expect(
        cartService.delete(createUser.id, faker.datatype.number()),
      ).rejects.toThrow(new NotFoundException('No Dessert found'));
    });

    it("should throw a error if dessert doesn't exist in a cart", async () => {
      await expect(
        cartService.delete(createUser.id, desserts[2].id),
      ).rejects.toThrow(new NotFoundException('No Dessert found in Cart'));
    });
  });
});
