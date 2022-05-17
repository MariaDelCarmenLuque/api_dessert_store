import { Status } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class DessertDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly uuid: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly price: number;

  @Expose()
  readonly stock: number;

  @Expose()
  readonly categoryId: number;

  @Expose()
  readonly status: Status;

  @Expose()
  readonly images: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly deletedAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;

  /**
   * Check if product has availability
   * @description Product can't be available when the stock is less than the quantity requestes in the order
   * @param quantity
   */

  public isAvailable(quantity: number): boolean {
    return this.stock > quantity;
  }

  /**
   * Check if product is active
   * @description Product can be inactive when has been disable by the Manager
   */

  public isActive(): boolean {
    return this.status == Status.ACTIVE;
  }

  /**
   * Get final price for given quantity
   * @param quantity
   */
  getFinalPrice(quantity: number): number {
    return this.price * quantity;
  }
}
