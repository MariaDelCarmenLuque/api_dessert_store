import faker from '@faker-js/faker';
import { CartItem, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AbstractFactory } from '../../utils/factories/abstract.factory';

type CartItemInput = Prisma.CartItemCreateInput;

export class CartItemFactory extends AbstractFactory<CartItem> {
  constructor(protected prisma: PrismaService) {
    super();
  }
  async make(input: CartItemInput, dessert?: any): Promise<CartItem> {
    const cartItem = await this.prisma.cartItem.create({
      data: {
        ...input,
        dessert: dessert ?? input.dessert,
        quantity: input.quantity ?? faker.datatype.number(),
        unitPrice: input.unitPrice ?? faker.datatype.float(),
        totalPrice: input.totalPrice ?? faker.datatype.float(),
      },
    });
    return cartItem;
  }

  async makeMany(
    factorial: number,
    input: CartItemInput,
    dessert?: any,
  ): Promise<CartItem[]> {
    return Promise.all(
      [...Array(factorial)].map((des) => this.make(input, des)),
    );
  }
}
