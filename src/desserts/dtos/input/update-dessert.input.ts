import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDessertInput } from './create-dessert.input';
@InputType({
  description: 'Dessert information to update a dessert',
})
export class UpdateDessertInput extends PartialType(CreateDessertInput) {}
