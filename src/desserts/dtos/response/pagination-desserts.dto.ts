import { Exclude, Expose, Type } from 'class-transformer';
import { Pagination } from '../../../utils/dtos/response/pagination.dto';
import { DessertDto } from './dessert.dto';

@Exclude()
export class PaginationDessertDto {
  /**
   * List of Desserts
   * @type [DessertDto]
   */
  @Type(() => DessertDto)
  @Expose()
  readonly desserts: DessertDto[];

  /**
   * Pagination
   * @type Pagination
   */
  @Type(() => Pagination)
  @Expose()
  readonly pagination: Pagination;
}
