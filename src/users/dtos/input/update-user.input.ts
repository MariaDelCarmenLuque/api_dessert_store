import { InputType, OmitType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType({
  description: 'User information to update a User',
})
export class UpdateUserInput extends OmitType(CreateUserInput, [
  'password',
] as const) {}
