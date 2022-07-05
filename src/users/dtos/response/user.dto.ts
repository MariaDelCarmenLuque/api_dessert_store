import { Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class UserDto {
  /**
   * Id of User
   * @example 1
   */
  @Expose()
  readonly id: number;

  /**
   * Role of User
   * @example 'USER or ADMIN'
   */
  @Expose()
  readonly role: Role;

  /**
   * First name of user
   * @example 'Maria'
   */
  @Expose()
  readonly firstName: string;

  /**
   * Last name of user
   * @example 'Luque'
   */
  @Expose()
  readonly lastName: string;

  /**
   * Username of User
   * @example maricarmen123
   */
  @Expose()
  readonly userName: string;

  /**
   * Email of user
   * @example 'miEmail@gmail.com'
   */
  @Expose()
  readonly email: string;

  /**
   * User's creation date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  readonly createdAt: Date;

  /**
   * User's update date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  readonly updatedAt: Date;

  /**
   * User's delete date
   * @example '2016-03-26 10:10:10-05:00'
   */
  @Expose()
  readonly deletedAt?: Date;
}
