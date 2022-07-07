import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/models/pagination.model';
import { Dessert } from './dessert.model';

@ObjectType()
export class PaginatedDessert extends Paginated(Dessert) {}
