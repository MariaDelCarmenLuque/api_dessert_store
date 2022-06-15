import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType()
export class User {
  @Field({ description: 'User id' })
  readonly id: number;

  @Field({ description: "User's email" })
  readonly role: Role;

  @Field({ description: "User's first name" })
  readonly firstName: string;

  @Field({ description: "User's last name" })
  readonly lastName: string;

  @Field({ description: "User's username" })
  readonly userName: string;

  @Field({ description: "User's email" })
  readonly email: string;

  @Field({ nullable: true, description: "User's deleted date" })
  readonly deletedAt: Date;

  @Field({ description: "User's updated date " })
  readonly updatedAt: Date;

  @Field({ description: "User's created date " })
  readonly createdAt: Date;
}
