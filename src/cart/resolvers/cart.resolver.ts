import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGetUser } from 'src/auth/decorators/gql-user.decorator';
import { CartItemInput } from '../dtos/input/create-cart-item.input';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../service/cart.service';

@Resolver()
export class CartResolver {
  constructor(private readonly cartsService: CartService) {}

  @Query(() => [CartItem], {
    description: ' Query: Return all items in a Cart',
  })
  async cartGelAllItems(@GqlGetUser() user) {
    return await this.cartsService.getItems(user.id);
  }

  @Mutation(() => CartItem, {
    description: 'Mutation: Create or Update a Cart Item',
  })
  async cartItemUpsert(
    @GqlGetUser() user,
    @Args('cartItemInput') cartItemInput: CartItemInput,
  ) {
    return await this.cartsService.upsertItem(user.id, cartItemInput);
  }

  @Mutation(() => CartItem, { description: 'Mutation: Delete a Cart Item' })
  async cartItemDelete(
    @GqlGetUser() user,
    @Args('desertId') dessertId: number,
  ) {
    return await this.cartsService.delete(user.id, dessertId);
  }
}
