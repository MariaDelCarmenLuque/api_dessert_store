import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class OrderItem {
  readonly id: number;

  @Field(() => Int, { description: "Order item's quantity" })
  readonly quantity: number;

  @Field(() => Float, { description: 'Dessert unit price' })
  readonly unitPrice: number;

  @Field(() => Float, { description: "Order item's total price" })
  readonly totalPrice: number;

  @Field({ description: 'Id Dessert information' })
  readonly dessertId: number;

  @Field({ description: "Order-Item's created date" })
  createdAt: Date;
}
