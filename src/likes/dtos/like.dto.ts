import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

@Exclude()
export class LikeDto {
  @ApiProperty({
    example: 'true',
  })
  @Expose()
  @IsBoolean()
  readonly isLike: boolean;
}
