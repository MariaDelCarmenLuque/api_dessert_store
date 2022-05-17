import { Controller, Get, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { OrderDto } from '../models/order.dto';
import { OrdersService } from '../service/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async getOrders(): Promise<OrderDto[]> {
    const userMock = {
      id: 5,
      uuid: 'c339beff-3284-469d-8b56-a2ac23a32ddc',
      firstName: 'asdfdsfsd',
      lastName: 'luque',
      userName: 'maritcarmn',
      email: 'marii@gmail.com',
      password: '$2a$10$Ai8.wlFyr1ah/N3TbaS3JOesYieGprWTGIqpQFy6GrBS7HDZTpzy2',
      role: Role.USER,
      deletedAt: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    return await this.ordersService.getMany(userMock);
  }

  //   @Post()
  //   async createOrder(): Promise<OrderDto> {
  //     const userMock = {
  //       id: 5,
  //       uuid: 'c339beff-3284-469d-8b56-a2ac23a32ddc',
  //       firstName: 'asdfdsfsd',
  //       lastName: 'luque',
  //       userName: 'maritcarmn',
  //       email: 'marii@gmail.com',
  //       password: '$2a$10$Ai8.wlFyr1ah/N3TbaS3JOesYieGprWTGIqpQFy6GrBS7HDZTpzy2',
  //       role: Role.USER,
  //       deletedAt: null,
  //       updatedAt: new Date(),
  //       createdAt: new Date(),
  //     };
  //     return await this.ordersService.create(userMock.id);
  //   }
}
