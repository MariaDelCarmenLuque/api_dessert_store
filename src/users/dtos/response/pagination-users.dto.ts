import { Exclude, Expose } from 'class-transformer';
import { Pagination } from 'src/utils/dtos/pagination.dto';
import { UserDto } from './user.dto';

@Exclude()
export class PagonationUserDto {
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
