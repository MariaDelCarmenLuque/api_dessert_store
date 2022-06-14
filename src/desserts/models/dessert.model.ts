import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { Category } from 'src/categories/models/category.model';
import { Image } from './image.model';

@ObjectType()
export class Dessert {
  @Field({ description: 'Dessert id' })
  readonly id: number;

  @Field({ description: 'Dessert uuid' })
  readonly uuid: string;

  @Field({ description: "Dessert's name" })
  readonly name: string;

  @Field({ description: "Dessert's description" })
  readonly description: string;

  @Field(() => Float, { description: "Dessert's price" })
  readonly price: number;

  @Field(() => Int, { description: "Dessert's stock" })
  readonly stock: number;

  @Field(() => Category, { description: "Dessert's category" })
  readonly category?: Category;

  @Field(() => [Image], { nullable: true, description: "Dessert's images" })
  readonly images?: Image[];

  @Field({ description: "Dessert's status" })
  readonly status: boolean;

  @Field({ nullable: true, description: "Dessert's deleted date" })
  readonly deletedAt?: Date;

  @Field({ description: "Dessert's updated date " })
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: string;

  @Field({ description: "Dessert's created date " })
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;
}
