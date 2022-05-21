import { Dessert } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class OrderItemsDto {
  @Expose()
  quantity: number;

  @Expose()
  unitPrice: number;

  @Expose()
  totalPrice: number;

  @Expose()
  dessert: Dessert;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;
}
