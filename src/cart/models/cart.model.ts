import { Field, Float, ObjectType } from '@nestjs/graphql';
import { CartItem } from './cart-item.model';

@ObjectType()
export class Cart {
  @Field({ description: 'Cart id' })
  id: number;

  @Field({ description: 'Cart uuid' })
  uuid: number;

  @Field(() => Float, { description: "Cart's total price" })
  amount: number;

  @Field({ description: "Cart's deleted date" })
  deletedAt: Date;

  @Field({ description: "Cart's updated date" })
  updatedAt: Date;

  @Field({ description: "Cart's created date" })
  createdAt: Date;

  @Field(() => [CartItem], { nullable: 'items', description: 'Cart items' })
  items: CartItem[];
}
