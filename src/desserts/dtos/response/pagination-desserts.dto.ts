import { Exclude, Expose } from 'class-transformer';
import { Pagination } from '../../../utils/dtos/response/pagination.dto';
import { DessertDto } from './dessert.dto';

@Exclude()
export class PaginationDessertDto {
  /**
   * List of Desserts
   * @type [DessertDto]
   */
  @Expose()
  readonly desserts: DessertDto[];

  /**
   * Pagination
   * @type Pagination
   */
  @Expose()
  readonly pagination: Pagination;
}
