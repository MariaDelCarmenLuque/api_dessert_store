import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/roles.enum';

@InputType({ description: 'User information to create a User' })
export class CreateUserInput {
  @Field(() => Role, { description: "User's Role" })
  @IsNotEmpty()
  readonly role: Role;

  @Field({ description: "User's first name" })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @Field({ description: "User's last name" })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @Field({ description: "User's username" })
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @Field({ description: "User's email" })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Field({ description: "User's password" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'PASSWORD_MIN_LENGTH: 8',
  })
  @MaxLength(16, {
    message: 'PASSWORD_MAX_LENGTH: 16',
  })
  @Matches(/\d/, {
    message: 'PASSWORD_MISSING: NUMBER',
  })
  @Matches(/[A-Z]/, {
    message: 'PASSWORD_MISSING: UPPER_CASE_LETTER',
  })
  @Matches(/[a-z]/, {
    message: 'PASSWORDS_MISSING: LOWER_CASE_LETTER',
  })
  @Matches(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, {
    message: 'PASSWORDS_MISSING: SPECIAL_CHARACTER',
  })
  readonly password: string;
}
