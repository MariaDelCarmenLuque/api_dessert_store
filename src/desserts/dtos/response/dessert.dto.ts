import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class DessertDto {
  /**
   * Id of Dessert
   * @example 1
   */
  @Expose()
  readonly id: number;
  /**
   * UUID of Dessert
   */
  @Expose()
  readonly uuid: string;

  /**
   * Name of Dessert
   * @example 'Chocolate cake'
   */
  @Expose()
  readonly name: string;

  /**
   * Description of Dessert
   * @example 'Chocolate cake contains a variety of dried fruits'
   */
  @Expose()
  readonly description: string;

  /**
   * Price of Dessert
   * @example 1050.5
   */
  @Expose()
  readonly price: number;

  /**
   * Stock of Dessert
   * @example 10
   */
  @Expose()
  readonly stock: number;

  /**
   * Id of Category
   * @example 5
   */
  @Expose()
  readonly categoryId: number;

  /**
   * Status of Desert
   * TRUE Active
   * FALSE Disable
   */
  @Expose()
  readonly status: boolean;

  /**
   * Images of a Dessert
   * @Example '[{https://empresas.blogthinkbig.com//Imagen3-245003649.jpg?w=800},{ttps://empresas.blogthinkbig.com//Imagen3-245003649.jpg?w=800}]',
   */
  @Expose()
  readonly images?: string;

  /**
   * Dessert's delete date
   * @example '2016-03-26 10:10:10-05:00'
   * @default null
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly deletedAt?: Date = null;

  /**
   * Dessert's update date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: string = 'CURRENT_TIMESTAMP';

  /**
   * Dessert's creation date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string = 'CURRENT_TIMESTAMP';

  /**
   * Check if product has availability
   * @description Product can't be available when the stock is less than the quantity requestes in the order
   * @param quantity
   */

  public isAvailable(quantity: number): boolean {
    return this.stock >= quantity;
  }

  /**
   * Check if product is active
   * @description Product can be inactive when has been disable by the Manager
   */

  public isActive(): boolean {
    return this.status == true;
  }

  /**
   * Get final price for given quantity
   * @param quantity
   */
  getFinalPrice(quantity: number): number {
    return this.price * quantity;
  }
}
