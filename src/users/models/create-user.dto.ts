import { Role } from '@prisma/client';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
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
  @Length(8, 20)
  readonly password: string;

  @IsNotEmpty()
  @IsLowercase()
  readonly role: Role;
}
