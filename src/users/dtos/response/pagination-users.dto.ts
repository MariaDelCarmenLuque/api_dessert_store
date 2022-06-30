import { Exclude, Expose, Type } from 'class-transformer';
import { Pagination } from '../../../utils/dtos/response/pagination.dto';
import { UserDto } from './user.dto';

@Exclude()
export class PaginationUserDto {
  /**
   * List of Users
   * @type [UserDto]
   */
  @Type(() => UserDto)
  @Expose()
  readonly users: UserDto[];

  /**
   * Pagination
   * @type Pagination
   */
  @Type(() => Pagination)
  @Expose()
  readonly pagination: Pagination;
}
