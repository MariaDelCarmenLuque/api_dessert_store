import { Dessert } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CartItemsDto {
  /**
   * Quantity of Items
   * @example 3
   */
  @Expose()
  readonly quantity: number;

  /**
   * Unit price of Item
   * @example 12.5
   */
  @Expose()
  readonly unitPrice: number;

  /**
   * Total Price of all items
   * @example 3
   */
  @Expose()
  readonly totalPrice: number;

  /**
   * Id of Cart
   * @example 3
   */
  @Expose()
  readonly cartId: number;

  /**
   * Dessert
   */
  @Expose()
  readonly dessert: Dessert;

  /**
   * CartItem's delete date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly deletedAt?: Date;

  /**
   * CartItem's update date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: string;

  /**
   * CartItem's creation date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;
}
