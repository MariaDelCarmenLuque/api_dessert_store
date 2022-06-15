import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  readonly id: number;

  @Field({ description: 'Dessert name' })
  readonly name: string;

  @Field({ description: "Dessert's updated date " })
  readonly updatedAt: Date;

  @Field({ description: "Dessert's created date " })
  readonly createdAt: Date;
}
