import { CartItem } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderDto {
  @Expose()
  uuid: string;

  @Expose()
  totalPrice: number;

  @Expose()
  createdAt: Date;

  @Expose()
  items: CartItem[];
}
