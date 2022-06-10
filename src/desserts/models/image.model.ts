import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Image {
  @Field({ description: 'Image id' })
  readonly id: string;

  @Field({ description: "Image's name" })
  readonly name: string;
}
