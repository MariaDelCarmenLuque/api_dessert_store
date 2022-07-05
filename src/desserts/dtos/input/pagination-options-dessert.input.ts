import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType({})
export class PaginationOptionsDessertInput {
  @Field({ nullable: true, description: 'Quantity of item per page' })
  @IsOptional()
  @IsNumber()
  readonly take?: number = 10;

  @Field({ nullable: true, description: 'Number of page' })
  @IsOptional()
  @IsNumber()
  readonly page?: number = 1;

  @Field({ nullable: true, description: "Category's Id of Dessert" })
  @IsOptional()
  @IsNumber()
  readonly categoryId?: number;
}
