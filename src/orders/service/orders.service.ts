import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { OrderItemsDto } from '../dtos/order-item.dto';
import { OrderDto } from '../dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMany(userId: number) {
    try {
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        rejectOnNotFound: true,
      });
      const orders = await this.prisma.order.findMany({
        where: { userId: userId },
        select: {
          id: true,
          totalPrice: true,
          createdAt: true,
          user: { select: { id: true, firstName: true, lastName: true } },
          orderItem: {
            select: { dessert: { select: { id: true, name: true } } },
          },
        },
      });
      const dataOrders = orders.map((order) => {
        const { orderItem, user, ...data } = order;
        return {
          ...data,
          user: user,
          items: plainToInstance(OrderItemsDto, orderItem),
        };
      });
      return plainToInstance(OrderDto, dataOrders);
    } catch (error) {
      throw error;
    }
  }
  async create(userId: number): Promise<OrderDto> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId: userId },
        select: {
          id: true,
          userId: true,
          amount: true,
          cartItems: {
            select: {
              quantity: true,
              totalPrice: true,
              dessert: {
                select: {
                  id: true,
                  name: true,
                  stock: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      if (!cart.cartItems?.length) {
        throw new BadRequestException('Cart is empty');
      }

      const cartItems =
        async (): Promise<Prisma.OrderItemCreateManyOrderInputEnvelope> => {
          return {
            data: await Promise.all(
              cart.cartItems.map(async (cartItem) => {
                await this.prisma.dessert.update({
                  where: { id: cartItem.dessert.id },
                  data: { stock: cartItem.dessert.stock - cartItem.quantity },
                });
                return {
                  dessertId: cartItem.dessert.id,
                  quantity: cartItem.quantity,
                  unitPrice: cartItem.dessert.price,
                  totalPrice: cartItem.totalPrice,
                };
              }),
            ),
            skipDuplicates: true,
          };
        };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [order, _, __] = await this.prisma.$transaction([
        this.prisma.order.create({
          data: {
            userId: cart.userId,
            totalPrice: cart.amount,
            orderItem: {
              createMany: await cartItems(),
            },
          },
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
            orderItem: {
              select: {
                quantity: true,
                unitPrice: true,
                totalPrice: true,
                dessert: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        }),

        this.prisma.cart.update({
          where: {
            id: cart.id,
          },
          data: {
            amount: 0,
          },
        }),

        this.prisma.cartItem.deleteMany({
          where: {
            cartId: cart.id,
          },
        }),
      ]);

      const { orderItem, ...input } = order;

      return plainToInstance(OrderDto, {
        ...input,
        items: orderItem,
      });
    } catch (error) {
      throw error;
    }
  }
}
