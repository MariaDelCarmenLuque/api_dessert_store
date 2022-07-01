import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGetUser } from 'src/auth/decorators/gql-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GqlJwtGuard } from 'src/auth/guards/gql-jwt.guard';
import { GqlRolesGuard } from 'src/auth/guards/gql-roles.guard';
import { Role } from 'src/auth/roles.enum';
import { CartItemInput } from '../dtos/input/create-cart-item.input';
import { PaginationOptionsCartItemInput } from '../dtos/input/pagination-cart-item.input';
import { CartItem } from '../models/cart-item.model';
import { Cart } from '../models/cart.model';
import { CartService } from '../service/cart.service';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartsService: CartService) {}

  @Query(() => [CartItem], {
    description: ' Query: Return all items in a Cart',
    name: 'cartGetAllItems',
  })
  @Roles(Role.USER)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async getAllItems(
    @GqlGetUser() user,
    @Args('paginationOptions')
    paginationOptions: PaginationOptionsCartItemInput,
  ) {
    const { cartItems, pagination } = await this.cartsService.getItems(
      user.id,
      paginationOptions,
    );
    const data = cartItems.map((cartItem) => {
      return {
        node: {
          ...cartItem,
        },
      };
    });

    return {
      edges: data,
      pageInfo: pagination,
    };
  }

  @Mutation(() => CartItem, {
    description: 'Mutation: Create or Update a Cart Item',
    name: 'cartItemsUpsert',
  })
  @Roles(Role.USER)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async upsertCartItems(
    @GqlGetUser() user,
    @Args('cartItemInput') cartItemInput: CartItemInput,
  ) {
    return await this.cartsService.upsertItem(user.id, cartItemInput);
  }

  @Mutation(() => CartItem, {
    description: 'Mutation: Delete a Cart Item',
    name: 'cartItemsDelete',
  })
  @Roles(Role.USER)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async deleteCartItems(
    @GqlGetUser() user,
    @Args('desertId') dessertId: number,
  ) {
    return await this.cartsService.delete(user.id, dessertId);
  }
}
