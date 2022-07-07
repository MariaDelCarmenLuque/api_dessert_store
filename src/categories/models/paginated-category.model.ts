import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/models/pagination.model';
import { Category } from './category.model';

@ObjectType()
export class PaginatedCategory extends Paginated(Category) {}
