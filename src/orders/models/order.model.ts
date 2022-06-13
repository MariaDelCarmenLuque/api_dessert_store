import { ObjectType, Field, Float } from '@nestjs/graphql';
import { OrderItem } from './order-item.model';

@ObjectType()
export class Order {
  @Field({ description: 'Order id' })
  readonly uuid: string;

  @Field(() => Float, { description: "Order's Total Price " })
  totalPrice: number;

  @Field({ description: "Order's created date" })
  createdAt: Date;

  @Field(() => [OrderItem], { nullable: true, description: "Order's items" })
  items: OrderItem[];
}
