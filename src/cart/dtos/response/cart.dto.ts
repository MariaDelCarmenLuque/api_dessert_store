import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CartDto {
  /**
   * If of a Cart
   * @example 1
   */
  @Expose()
  readonly id: number;

  /**
   * Uuid of a Cart
   */
  @Expose()
  readonly uuid: string;

  /**
   * Total Price of all items in a Cart
   */
  @Expose()
  readonly amount: number;

  /**
   * Cart's purchased date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly purchasedAt: Date;

  /**
   * CartI's delete date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly deletedAt: Date;

  /**
   * Cart's update date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: string;

  /**
   * Cart's creation date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;
}
