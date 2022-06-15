import { UseGuards } from '@nestjs/common';
import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlGetUser } from 'src/auth/decorators/gql-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GqlJwtGuard } from 'src/auth/guards/gql-jwt.guard';
import { GqlRolesGuard } from 'src/auth/guards/gql-roles.guard';
import { Role } from 'src/auth/roles.enum';
import { Dessert } from 'src/desserts/models/dessert.model';
import { DessertsService } from 'src/desserts/service/desserts.service';
import { OrderItem } from '../models/order-item.model';
import { Order } from '../models/order.model';
import { OrdersService } from '../service/orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly dessertsService: DessertsService,
  ) {}

  @Roles(Role.USER)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  @Query(() => [Order], {
    description: 'Query; Return all Orders of a User',
    name: 'orderGetAll',
  })
  async getAllOrder(@GqlGetUser() user) {
    return this.ordersService.getMany(user.id);
  }

  @Mutation(() => Order, {
    description: 'Mutation: Create a Order',
    name: 'orderCreate',
  })
  @Roles(Role.USER)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async createOrder(@GqlGetUser() user): Promise<Order> {
    return this.ordersService.create(user.id);
  }

  @ResolveField('dessert', () => Dessert)
  async dessert(@Parent() orderItem: OrderItem): Promise<Dessert> {
    return this.dessertsService.getDessertByOrderItemId(orderItem.id);
  }
}
