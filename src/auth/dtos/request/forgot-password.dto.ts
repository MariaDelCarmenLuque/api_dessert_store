import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  /**
   * Email of user
   * @example 'myEmail@gmail.com'
   */
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
