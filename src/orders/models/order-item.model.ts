import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Dessert } from 'src/desserts/models/dessert.model';

@ObjectType()
export class OrderItem {
  @Field(() => Int, { description: "Order item's quantity" })
  readonly quantity: number;

  @Field(() => Float, { description: 'Dessert unit price' })
  readonly unitPrice: number;

  @Field(() => Float, { description: "Order item's total price" })
  readonly totalPrice: number;

  @Field({ description: 'Dessert information' })
  readonly dessert: Dessert;

  @Field({ description: "Order-Item's created date" })
  createdAt: Date;
}
