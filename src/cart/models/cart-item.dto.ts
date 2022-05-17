import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CartItemsDto {
  @Expose()
  quantity: number;

  @Expose()
  unitPrice: number;

  @Expose()
  totalPrice: number;

  @Expose()
  cartId: number;

  @Expose()
  dessertId: number;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly deletedAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;
}
