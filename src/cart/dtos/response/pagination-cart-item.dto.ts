import { Exclude, Expose, Type } from 'class-transformer';
import { Pagination } from '../../../utils/dtos/response/pagination.dto';
import { CartItemsDto } from './cart-item.dto';

@Exclude()
export class PaginationCartItemDto {
  /**
   * List of Cart Items
   * @type [CartItemsDto]
   */
  @Type(() => CartItemsDto)
  @Expose()
  readonly cartItems: CartItemsDto[];

  /**
   * Pagination
   * @type Pagination
   */
  @Type(() => Pagination)
  @Expose()
  readonly pagination: Pagination;
}
