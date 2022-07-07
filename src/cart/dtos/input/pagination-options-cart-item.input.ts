import { InputType } from '@nestjs/graphql';
import { PaginationOptionsInput } from '../../../utils/dtos/input/pagination-options.input';

@InputType({})
export class PaginationOptionsCartItemInput extends PaginationOptionsInput {}
