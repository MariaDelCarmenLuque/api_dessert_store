import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Token {
  @Field({ description: 'Access Token' })
  readonly accessToken: string;

  @Field({ description: 'Expiration information' })
  readonly exp: number;

  @Field({ description: 'Refresh Token' })
  readonly refreshToken: string;
}
