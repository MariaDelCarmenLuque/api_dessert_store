import { Field, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';

@ObjectType()
export class Like {
  @Field({ description: "Like's dessertId" })
  readonly dessertId: number;

  @Field({ description: "Like's userId" })
  readonly userId: number;

  @Field({ description: 'Like or Dislike' })
  readonly isLike: boolean;

  @Field({ description: "Like's created date " })
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;
}
