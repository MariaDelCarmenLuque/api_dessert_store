import { Role } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * First name of user
   * @example 'Maria'
   */
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly firstName: string;

  /**
   * Last name of user
   * @example 'Luque'
   */
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly lastName: string;

  /**
   * Username of User
   * @example maricarmen123
   */
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  /**
   * Email of user
   * @example 'miEmail@gmail.com'
   */
  @IsEmail()
  readonly email: string;

  /**
   * Password
   * @example 'my*Passw0rd'
   */
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
  @IsString()
  readonly password: string;

  /**
   * Role of User
   * @example 'USER or ADMIN'
   */
  @IsIn([Role.ADMIN, Role.USER])
  @IsNotEmpty()
  @IsUppercase()
  readonly role: Role;
}
