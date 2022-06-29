import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Pagination {
  /**
   * Total items
   * @example 100
   */
  @Expose()
  totalItems: number;

  /**
   * Total pages
   * @example 10
   */
  @Expose()
  totalPages: number;

  /**
   * Items per page
   * @example 10
   */
  @Expose()
  perPage: number;

  /**
   * Number of current page
   * @example 1
   */
  @Expose()
  currentPage: number;

  /**
   * Number of previous page
   * @example null
   */
  @Expose()
  prevPage: number | null;

  /**
   * Number of next page
   * @example 2
   */
  @Expose()
  nextPage: number | null;
}
