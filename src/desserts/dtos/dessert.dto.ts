import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class DessertDto {
  @ApiProperty({
    readOnly: true,
    type: Number,
    example: 1,
    description: 'Dessert ID',
  })
  @Expose()
  readonly id: number;

  @Expose()
  readonly uuid: string;

  @ApiProperty({
    example: 'Chocolate cake',
    description: 'Dessert name',
    nullable: false,
    maxLength: 40,
  })
  @Expose()
  readonly name: string;

  @ApiProperty({
    example: 'Chocolate cake contains a variety of dried fruits',
    description: 'Dessert description',
    nullable: false,
    maxLength: 255,
  })
  @Expose()
  readonly description: string;

  @ApiProperty({
    example: 1050.5,
    description: 'Dessert Price',
    nullable: false,
  })
  @Expose()
  readonly price: number;

  @ApiProperty({
    example: 10,
    description: 'Dessert Stock',
    nullable: false,
    maxLength: 1000000,
  })
  @Expose()
  readonly stock: number;

  @ApiProperty({
    description: 'Id of the Dessert category',
    example: 1,
    nullable: false,
  })
  @Expose()
  readonly categoryId: number;

  @ApiProperty({
    description: 'Status of dessert',
    default: 'true',
    example: 'false',
  })
  @Expose()
  readonly status: boolean;

  @ApiProperty({
    description: 'Images of Dessert',
    nullable: true,
    example:
      '[{https://empresas.blogthinkbig.com//Imagen3-245003649.jpg?w=800},{ttps://empresas.blogthinkbig.com//Imagen3-245003649.jpg?w=800}]',
  })
  @Expose()
  readonly images: string;

  @ApiProperty({
    example: '2016-03-26 10:10:10-05:00',
    description: "Dessert's delete date",
    default: null,
    type: Date,
    format: 'date-time',
    nullable: true,
  })
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly deletedAt: Date;

  @ApiProperty({
    example: '2016-03-26 10:10:10-05:00',
    description: "Dessert's last update date",
    default: 'CURRENT_TIMESTAMP',
    type: Date,
    format: 'date-time',
  })
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: string;

  @ApiProperty({
    example: '2016-03-26 10:10:10-05:00',
    description: "Dessert's creation date",
    default: 'CURRENT_TIMESTAMP',
    type: Date,
    format: 'date-time',
  })
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;

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
