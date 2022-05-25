import { Dessert } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class OrderItemsDto {
  @Expose()
  readonly quantity: number;

  @Expose()
  readonly unitPrice: number;

  @Expose()
  readonly totalPrice: number;

  @Expose()
  readonly dessert: Dessert;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;
}
