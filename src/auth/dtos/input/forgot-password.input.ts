import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType({
  description: 'Email to forgot password ',
})
export class ForgotPasseordInput {
  @Field({ description: "User's email" })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
