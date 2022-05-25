import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderDto {
  @ApiProperty({
    description: 'uuid order',
    example: faker.datatype.uuid(),
  })
  @Expose()
  readonly uuid: string;

  @ApiProperty({
    description: 'total Price of a order',
    example: faker.datatype.number(),
  })
  @Expose()
  readonly totalPrice: number;

  @ApiProperty({
    description: 'Date of create a order',
    example: faker.datatype.datetime(),
  })
  @Expose()
  readonly createdAt: Date;

  @ApiProperty({
    description: 'List od OrderItems',
  })
  @Expose()
  readonly items: OrderItem[];
}
