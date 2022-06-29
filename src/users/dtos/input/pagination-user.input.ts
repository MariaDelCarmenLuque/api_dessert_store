import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType({})
export class PaginationOptionsUserInput {
  @Field({ nullable: true, description: 'Quantity of item per page' })
  @IsOptional()
  @IsNumber()
  take?: number = 10;

  @Field({ nullable: true, description: 'Number of page' })
  @IsOptional()
  @IsNumber()
  page?: number = 1;
}
