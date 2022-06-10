import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType({ description: 'User information to create a User' })
export class CreateUserInput {
  @Field({ description: "User's Role" })
  @IsNotEmpty()
  role: Role;

  @Field({ description: "User's first name" })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field({ description: "User's last name" })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field({ description: "User's username" })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Field({ description: "User's email" })
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field({ description: "User's password" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
