import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGetUser } from 'src/auth/decorators/gql-user.decorator';
import { CartItemInput } from '../dtos/input/create-cart-item.input';
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
  async getAllItems(@GqlGetUser() user) {
    return await this.cartsService.getItems(user.id);
  }

  @Mutation(() => CartItem, {
    description: 'Mutation: Create or Update a Cart Item',
    name: 'cartItemsUpsert',
  })
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
  async deleteCartItems(
    @GqlGetUser() user,
    @Args('desertId') dessertId: number,
  ) {
    return await this.cartsService.delete(user.id, dessertId);
  }
}
