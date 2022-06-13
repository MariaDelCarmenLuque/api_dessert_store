import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@InputType({
  description: 'Like information to create a Like',
})
export class CreateLikeInput {
  @Field({ description: 'True (Like) or False (Dislike)' })
  @IsBoolean()
  readonly isLike: boolean;
}
