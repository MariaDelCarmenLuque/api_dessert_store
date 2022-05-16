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
}
