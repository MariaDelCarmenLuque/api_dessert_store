import { Mutation, Query } from '@nestjs/graphql';
import { GqlGetUser } from 'src/auth/decorators/gql-user.decorator';
import { Order } from '../models/order.model';
import { OrdersService } from '../service/orders.service';

export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [Order], { description: 'Query; Return all Orders' })
  async ordersGetAll(@GqlGetUser() user) {
    return await this.ordersService.getMany(user.id);
  }

  @Mutation(() => Order, { description: 'Mutation: Create a Order' })
  async orderCreate(@GqlGetUser() user) {
    return await this.ordersService.create(user.id);
  }
}
