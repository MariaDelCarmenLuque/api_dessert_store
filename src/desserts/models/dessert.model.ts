import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';
import { Image } from './image.model';

@ObjectType()
export class Dessert {
  @Field({ description: 'Dessert id' })
  id: number;

  @Field({ description: 'Dessert uuid' })
  uuid: number;

  @Field({ description: "Dessert's name" })
  name: string;

  @Field({ description: "Dessert's description" })
  description: string;

  @Field(() => Float, { description: "Dessert's price" })
  price: number;

  @Field(() => Int, { description: "Dessert's stock" })
  stock: number;

  @Field(() => Category, { description: "Dessert's category" })
  category: Category;

  @Field(() => [Image], {
    nullable: 'items',
    description: "Dessert's images",
  })
  images: Image[];

  @Field({ description: "Dessert's status" })
  status: boolean;

  @Field({ nullable: true, description: "Dessert's deleted date" })
  deletedAt: Date;

  @Field({ description: "Dessert's updated date " })
  updatedAt: Date;

  @Field({ description: "Dessert's created date " })
  createdAt: Date;
}
