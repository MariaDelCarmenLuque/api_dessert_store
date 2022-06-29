import { Exclude, Expose } from 'class-transformer';
import { Pagination } from '../../../utils/dtos/response/pagination.dto';
import { UserDto } from './user.dto';

@Exclude()
export class PaginationUserDto {
  /**
   * List of Users
   * @example [UserDto]
   */
  @Expose()
  users: UserDto[];

  /**
   * Pagination
   * @example Pagination
   */
  @Expose()
  pagination: Pagination;
}
