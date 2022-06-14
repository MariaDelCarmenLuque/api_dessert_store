import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGetUser } from 'src/auth/decorators/gql-user.decorator';
import { Order } from '../models/order.model';
import { OrdersService } from '../service/orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [Order], {
    description: 'Query; Return all Orders',
    name: 'OrderGetAll',
  })
  async getAllOrder(@GqlGetUser() user) {
    return await this.ordersService.getMany(user.id);
  }

  @Mutation(() => Order, {
    description: 'Mutation: Create a Order',
    name: 'OrderCreate',
  })
  async createOrder(@GqlGetUser() user) {
    return await this.ordersService.create(user.id);
  }
}
