import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field({ description: 'Dessert id' })
  id: string;

  @Field({ description: 'Dessert name' })
  name: string;

  @Field({ description: "Dessert's updated date " })
  updatedAt: Date;

  @Field({ description: "Dessert's created date " })
  createdAt: Date;
}
