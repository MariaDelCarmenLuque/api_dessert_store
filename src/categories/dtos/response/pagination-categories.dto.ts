import { Exclude, Expose } from 'class-transformer';
import { Pagination } from '../../../utils/dtos/response/pagination.dto';
import { CategoryDto } from './category.dto';

@Exclude()
export class PaginationCategoryDto {
  /**
   * List of Categories
   * @type [CategoryDto]
   */
  @Expose()
  readonly categories: CategoryDto[];

  /**
   * Pagination
   * @type Pagination
   */
  @Expose()
  readonly pagination: Pagination;
}
