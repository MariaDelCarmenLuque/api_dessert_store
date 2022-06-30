import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../utils/models/pagination.model';
import { User } from './user.model';

@ObjectType()
export class PaginatedUser extends Paginated(User) {}
