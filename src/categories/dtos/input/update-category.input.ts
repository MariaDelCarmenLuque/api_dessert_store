import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';

@InputType({
  description: 'Category information to update a Category',
})
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
