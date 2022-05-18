import { Role } from '@prisma/client';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @IsEmail()
  readonly email: string;

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

  @IsNotEmpty()
  @IsLowercase()
  readonly role: Role;
}
