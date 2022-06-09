import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field({ description: 'User id' })
  id: number;

  @Field({ description: "User's email" })
  role: string;

  @Field({ description: "User's first name" })
  firstName: string;

  @Field({ description: "User's last name" })
  lastName: string;

  @Field({ description: "User's username" })
  userName: string;

  @Field({ description: "User's email" })
  email: string;

  @Field({ nullable: true, description: "User's deleted date" })
  deletedAt: Date;

  @Field({ description: "User's updated date " })
  updatedAt: Date;

  @Field({ description: "User's created date " })
  createdAt: Date;
}
