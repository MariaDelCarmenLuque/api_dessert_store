import { Image } from '@prisma/client';
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
   * @example 15.5
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
  readonly images?: Image[];

  /**
   * Dessert's delete date
   * @example '2016-03-26 10:10:10-05:00'
   * @default null
   */
  @Expose()
  readonly deletedAt?: Date;

  /**
   * Dessert's update date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  readonly updatedAt: Date;

  /**
   * Dessert's creation date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  readonly createdAt: Date;
}
