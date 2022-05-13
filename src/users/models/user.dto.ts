import { Role } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
@Exclude()
export class User {
  @Expose()
  readonly id: number;

  @Expose()
  readonly role: Role;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly userName: string;

  @Expose()
  readonly email: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly deletedAt?: Date;
}
