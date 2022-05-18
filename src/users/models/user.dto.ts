import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
@Exclude()
export class User {
  @ApiProperty({
    readOnly: true,
    type: Number,
    example: 1,
    description: 'User ID',
  })
  @Expose()
  readonly id: number;

  @ApiProperty({
    example: 'admin',
    description: 'User Role (user or admin)',
    nullable: false,
    type: Role,
  })
  @Expose()
  readonly role: Role;

  @ApiProperty({
    name: 'firstName',
    description: 'Firstname of User',
    type: String,
    nullable: true,
    example: 'Maria',
  })
  @Expose()
  readonly firstName: string;

  @ApiProperty({
    name: 'lastName',
    description: 'Firstname of User',
    type: String,
    nullable: true,
    example: 'Luque',
  })
  @Expose()
  readonly lastName: string;

  @ApiProperty({
    name: 'userName',
    description: 'Username of User',
    type: String,
    nullable: true,
    example: 'mariCarmen',
  })
  @Expose()
  readonly userName: string;

  @ApiProperty({
    name: 'email',
    description: 'Email of User',
    type: String,
    nullable: false,
    example: 'maria@dessertstore.com',
  })
  @Expose()
  readonly email: string;

  @ApiProperty({
    example: '2016-03-26 10:10:10-05:00',
    description: "User's creation date",
    default: 'CURRENT_TIMESTAMP',
    type: Date,
    format: 'date-time',
  })
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date;

  @ApiProperty({
    example: '2016-03-26 10:10:10-05:00',
    description: "User's last update date",
    default: 'CURRENT_TIMESTAMP',
    type: Date,
    format: 'date-time',
  })
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly updatedAt: Date;

  @ApiProperty({
    example: '2016-03-26 10:10:10-05:00',
    description: "User's delete date",
    default: null,
    type: Date,
    format: 'date-time',
    nullable: true,
  })
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly deletedAt?: Date;
}
