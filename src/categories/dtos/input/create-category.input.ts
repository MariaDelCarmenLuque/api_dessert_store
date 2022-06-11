import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType({
  description: 'Category information to create a Category',
})
export class CreateCategoryInput {
  @Field({ description: "Category's name" })
  @IsNotEmpty()
  @IsString()
  @Length(1, 40)
  readonly name: string;
}
