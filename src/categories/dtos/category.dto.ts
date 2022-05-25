import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    type: String,
    maxLength: 40,
    description: 'Name of the category',
    example: 'Cake',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 40)
  readonly name: string;
}
