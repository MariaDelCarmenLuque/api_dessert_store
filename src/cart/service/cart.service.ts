import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { OrdersService } from '../../orders/service/orders.service';
import { DessertDto } from '../../desserts/dtos/response/dessert.dto';
import { PrismaService } from '../../prisma.service';
import { CartDto } from '../dtos/response/cart.dto';
import { CreateCartItemDto } from '../dtos/request/create-cart-item.dto';
import { PaginationCartItemDto } from '../dtos/response/pagination-cart-item.dto';
import { getPagination } from '../../utils/pagination.utils';
import { PaginationOptionsCartItemDto } from '../dtos/request/pagination-options-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrdersService,
  ) {}

  async getItems(
    userId: number,
    pagination: PaginationOptionsCartItemDto,
  ): Promise<PaginationCartItemDto> {
    try {
      const { page, take } = pagination;
      const cart = await this.prisma.cart.findUnique({
        where: {
          userId: userId,
        },
      });
      const cartItems = await this.prisma.cartItem.findMany({
        where: { cartId: cart.id },
        select: {
          dessert: { select: { id: true, name: true } },
          quantity: true,
          unitPrice: true,
          totalPrice: true,
        },
        skip: take * (page - 1),
        take: take,
        orderBy: { createdAt: 'asc' },
      });
      const totalItems = await this.prisma.cartItem.count();
      const cartItemsResponse = {
        cartItems,
        pagination: getPagination(pagination, totalItems),
      };
      return plainToInstance(PaginationCartItemDto, cartItemsResponse);
    } catch (error) {
      throw error;
    }
  }

  async upsertItem(
    userId: number,
    createCartItem: CreateCartItemDto,
  ): Promise<CartDto> {
    try {
      const { dessertId, quantity } = createCartItem;

      const dessert = await this.prisma.dessert.findUnique({
        where: {
          id: dessertId,
        },
        rejectOnNotFound: false,
      });
      if (!dessert) throw new BadRequestException('No Dessert found');
      const newDessert = plainToClass(DessertDto, dessert);

      if (!newDessert.status)
        throw new ConflictException('This dessert has been disable');

      if (!(newDessert.stock >= createCartItem.quantity)) {
        throw new BadRequestException('Required quantity not available');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          cart: true,
          id: true,
        },
        rejectOnNotFound: true,
      });

      /***
       * Find previous cartItem and catch your totalPrice,then update the new totalPrice
       */
      const cartItem = await this.prisma.cartItem.findUnique({
        where: {
          cartId_dessertId: { dessertId: newDessert.id, cartId: user.cart.id },
        },

        rejectOnNotFound: false,
      });

      const productTotalPrice = newDessert.price * createCartItem.quantity;

      const previousProductTotalPrice = !cartItem ? 0 : cartItem.totalPrice;
      const totalPrice =
        user.cart.amount + productTotalPrice - previousProductTotalPrice;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: number, dessertId: number) {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: { id: dessertId },
      });
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          cart: true,
          id: true,
        },
      });

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
        throw new HttpException(
          'No Dessert found in Cart',
          HttpStatus.NOT_FOUND,
        );
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

  async purchaseCart(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          cart: true,
          id: true,
        },
        rejectOnNotFound: true,
      });
      const cart = await this.prisma.cart.findUnique({
        where: {
          userId: userId,
        },
        select: { amount: true },
        rejectOnNotFound: true,
      });

      if (cart.amount != 0) {
        this.prisma.cart.update({
          where: { id: user.cart.id },
          data: { purchasedAt: new Date() },
        });

        return this.orderService.create(userId);
      }
    } catch (error) {
      throw error;
    }
  }
}
