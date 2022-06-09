import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Image {
  @Field({ description: 'Image id' })
  id: string;

  @Field({ description: "Image's name" })
  name: string;
}
