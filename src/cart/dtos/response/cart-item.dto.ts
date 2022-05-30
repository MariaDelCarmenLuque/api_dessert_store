import { Dessert } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CartItemsDto {
  @Expose()
  readonly quantity: number;

  @Expose()
  readonly unitPrice: number;

  @Expose()
  readonly totalPrice: number;

  @Expose()
  readonly cartId: number;

  @Expose()
  readonly dessert: Dessert;

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
