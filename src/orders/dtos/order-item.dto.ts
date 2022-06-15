import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderItemsDto {
  /**
   * Quantity of item
   * @example 3
   */
  @Expose()
  readonly quantity: number;

  /**
   * Unit price of item
   * @example 12.5
   */
  @Expose()
  readonly unitPrice: number;

  /**
   * Total price of items
   * @example 37.5
   */
  @Expose()
  readonly totalPrice: number;

  /**
   * Id Dessert
   */
  @Expose()
  readonly dessertId: number;

  /**
   * OrderItem's created date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  readonly createdAt: Date;
}
