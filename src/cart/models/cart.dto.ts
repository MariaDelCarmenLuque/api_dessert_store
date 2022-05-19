import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CartDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly uuid: string;

  @Expose()
  readonly amount: number;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly purchasedAt: Date;

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
