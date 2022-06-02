import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    example: 'true',
  })
  @IsBoolean()
  readonly isLike: boolean;
}
