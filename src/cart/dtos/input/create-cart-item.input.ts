import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

@InputType({
  description: 'Item information to create or update a Cart-Item',
})
export class CartItemInput {
  @Field({ description: 'Id of the dessert to be added' })
  @IsNotEmpty()
  @IsNumber()
  readonly dessertId: number;

  @Field(() => Int, {
    description: 'Quantity of dessert to be added ',
  })
  @IsNotEmpty()
  @IsInt()
  readonly quantity: number;
}
