import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { DessertDto } from 'src/desserts/models/dessert.dto';
import { PrismaService } from 'src/prisma.service';
import { CartItemsDto } from '../models/cart-item.dto';
import { CartDto } from '../models/cart.dto';
import { CreateCartItemDto } from '../models/create-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getItems(userId: number) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: {
          userId: userId,
        },
        rejectOnNotFound: false,
      });
      const cartItems = await this.prisma.cartItem.findMany({
        where: { cartId: cart.id },
        select: {
          dessert: { select: { id: true, name: true } },
          quantity: true,
          unitPrice: true,
          totalPrice: true,
        },
      });
      return plainToInstance(CartItemsDto, cartItems);
    } catch (error) {
      throw error;
    }
  }

  async updateItem(userId: number, createCartItem: CreateCartItemDto) {
    const { dessertId, quantity } = createCartItem;

    const dessert = await this.prisma.dessert.findUnique({
      where: {
        id: dessertId,
      },
      rejectOnNotFound: false,
    });

    const newDessert = plainToClass(DessertDto, dessert);

    if (!dessert) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    if (!newDessert.isActive())
      throw new UnauthorizedException('This product has been disable');

    if (!newDessert.isAvailable(createCartItem.quantity)) {
      throw new ForbiddenException('Required quantity not available');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        cart: true,
        id: true,
      },
      rejectOnNotFound: false,
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    /***
     * Find previous cartItem and catch your totalPrice,then update the new totalPrice
     */
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_dessertId: { dessertId: newDessert.id, cartId: user.cart.id },
      },

      rejectOnNotFound: false,
    });

    const productTotalPrice = newDessert.getFinalPrice(createCartItem.quantity);
    const previousProductTotalPrice = !cartItem ? 0 : cartItem.totalPrice;
    const totalPrice =
      user.cart.amount + productTotalPrice - previousProductTotalPrice;

    const [newCartItem] = await this.prisma.$transaction([
      this.prisma.cart.update({
        where: { id: user.cart.id },
        data: { amount: totalPrice },
      }),
      this.prisma.cartItem.upsert({
        where: {
          cartId_dessertId: {
            cartId: user.cart.id,
            dessertId: newDessert.id,
          },
        },
        update: {
          unitPrice: newDessert.price,
          quantity,
          totalPrice: productTotalPrice,
        },
        create: {
          dessert: {
            connect: { id: newDessert.id },
          },
          cart: {
            connect: { id: user.cart.id },
          },
          unitPrice: dessert.price,
          quantity,
          totalPrice: newDessert.price,
        },

        select: {
          dessert: { select: { id: true, name: true } },
          quantity: true,
          unitPrice: true,
          totalPrice: true,
        },
      }),
    ]);
    return plainToInstance(CartDto, newCartItem);
  }

  async delete(userId: number, dessertId: number) {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: { id: dessertId },
        rejectOnNotFound: false,
      });

      if (!dessert) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          cart: true,
          id: true,
        },
        rejectOnNotFound: false,
      });
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const cartItem = await this.prisma.cartItem.findUnique({
        where: {
          cartId_dessertId: {
            dessertId: dessert.id,
            cartId: user.cart.id,
          },
        },
        rejectOnNotFound: false,
      });
      if (!cartItem)
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      const totalPrice = user.cart.amount - cartItem.totalPrice;

      await this.prisma.$transaction([
        this.prisma.cart.update({
          where: {
            id: user.cart.id,
          },
          data: {
            amount: totalPrice,
          },
        }),
        this.prisma.cartItem.delete({
          where: {
            cartId_dessertId: {
              cartId: user.cart.id,
              dessertId: dessert.id,
            },
          },
        }),
      ]);

      return true;
    } catch (error) {
      throw error;
    }
  }
}
