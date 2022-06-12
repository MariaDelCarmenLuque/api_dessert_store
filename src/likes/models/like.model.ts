import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Like {
  @Field({ description: "Like's dessertId" })
  readonly dessertId: number;

  @Field({ description: "Like's userId" })
  readonly userId: number;

  @Field({ description: 'Like or Dislike' })
  readonly isLike: boolean;

  @Field({ description: "Like's created date " })
  readonly createdAt: Date;
}
