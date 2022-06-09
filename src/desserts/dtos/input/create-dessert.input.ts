import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

@InputType({
  description: 'Dessert information to create a dessert',
})
export class DessertInput {
  @Field({ description: "Dessert's name" })
  @IsNotEmpty()
  @IsString()
  @Length(1, 40)
  name: string;

  @Field({ description: "Dessert's description" })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  description: string;

  @Field(() => Float, { description: "Dessert's price" })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @Field(() => Int, { description: "Dessert's stock" })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  stock: number;

  @Field({ description: "Dessert's category id" })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
