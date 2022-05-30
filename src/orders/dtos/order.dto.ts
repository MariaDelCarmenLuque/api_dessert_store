import { OrderItem } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderDto {
  /**
   * Uuid order
   */
  @Expose()
  readonly uuid: string;

  /**
   * Total price of a Order
   */
  @Expose()
  readonly totalPrice: number;

  /**
   * Date of created a order
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  readonly createdAt: Date;

  /**
   * List of Order items
   */
  @Expose()
  readonly items: OrderItem[];
}
