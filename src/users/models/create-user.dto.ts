import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    name: 'firstName',
    description: 'Firstname of User',
    example: 'Maria',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @ApiProperty({
    name: 'lastName',
    description: 'Firstname of User',
    example: 'Luque',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @ApiProperty({
    name: 'userNAme',
    description: 'Username of User',
    example: 'mariCarmen',
  })
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @ApiProperty({
    description: 'Email of user',
    type: String,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Password of user',
    type: String,
  })
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

  @IsIn([Role.ADMIN, Role.USER])
  @IsNotEmpty()
  @IsLowercase()
  readonly role: Role;
}
