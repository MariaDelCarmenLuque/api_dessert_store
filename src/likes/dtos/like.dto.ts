import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class LikeDto {
  @ApiProperty({
    description: 'Id of User',
    type: Number,
  })
  @Expose()
  readonly userId: number;

  @ApiProperty({
    description: 'Id of Dessert',
    type: Number,
  })
  @Expose()
  readonly dessertId: number;

  @ApiProperty({
    description: 'Like or Dislike',
    default: true,
    type: Boolean,
    example: 'true',
  })
  @Expose()
  readonly isLike: boolean;

  @ApiProperty({
    example: '2016-03-26 10:10:10-05:00',
    description: "Dessert's creation date",
    default: 'CURRENT_TIMESTAMP',
    type: Date,
    format: 'date-time',
  })
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: string;
}
