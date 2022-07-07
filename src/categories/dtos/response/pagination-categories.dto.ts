import { Exclude, Expose, Type } from 'class-transformer';
import { Pagination } from '../../../utils/dtos/response/pagination.dto';
import { CategoryDto } from './category.dto';

@Exclude()
export class PaginationCategoryDto {
  /**
   * List of Categories
   * @type [CategoryDto]
   */
  @Type(() => CategoryDto)
  @Expose()
  readonly categories: CategoryDto[];

  /**
   * Pagination
   * @type Pagination
   */
  @Type(() => Pagination)
  @Expose()
  readonly pagination: Pagination;
}
