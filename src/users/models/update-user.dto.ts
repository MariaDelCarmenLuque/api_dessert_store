import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsNotEmpty()
  @IsString()
  readonly userName?: string;

  @IsEmail()
  readonly email?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly role?: Role;
}
