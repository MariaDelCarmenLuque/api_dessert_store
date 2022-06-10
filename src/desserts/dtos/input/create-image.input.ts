import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ImageInput {
  @Field({ description: "Image's name" })
  @IsString()
  name: string;
}
