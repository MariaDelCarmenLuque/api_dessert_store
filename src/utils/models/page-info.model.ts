import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => Int, { description: 'Total pages' })
  readonly totalPages: number;

  @Field(() => Int, { description: 'Total items' })
  readonly totalItems: number;

  @Field(() => Int, { description: 'Items per page' })
  readonly perPage: number;

  @Field(() => Int, { description: 'Number of current page' })
  readonly currentPage: number;

  @Field(() => Int, { nullable: true, description: 'Number of previous page' })
  readonly prevPage?: number;

  @Field(() => Int, { nullable: true, description: 'Number of next page' })
  readonly nextPage?: number;
}
