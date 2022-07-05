import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginationOptionsInput } from '../../../utils/dtos/input/pagination-options.input';

@InputType({})
export class PaginationOptionsDessertInput extends PaginationOptionsInput {
  @Field({ nullable: true, description: "Category's Id of Dessert" })
  @IsOptional()
  @IsNumber()
  readonly categoryId?: number;
}
