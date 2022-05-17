import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CartItemsDto } from 'src/cart/models/cart-item.dto';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from '../models/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getMany(user: User) {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
        },
        rejectOnNotFound: false,
      });
      if (!findUser) throw new NotFoundException('User not found');
      let where = {};
      if (user.role !== Role.ADMIN) {
        where = {
          user: {
            id: findUser.id,
          },
        };
      }
      const orders = await this.prisma.order.findMany({
        where,
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
          client: user,
          items: plainToInstance(CartItemsDto, orderItem),
        };
      });
      return plainToInstance(OrderDto, dataOrders);
    } catch (error) {
      throw error;
    }
  }

}
