import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Image {
  readonly id: number;

  @Field({ description: "Image's uuid" })
  readonly uuid: string;

  @Field({ description: "Image's name" })
  readonly name: string;

  @Field({ description: "Image's updated date " })
  readonly updatedAt: Date;

  @Field({ description: "Image's created date " })
  readonly createdAt: Date;
}
