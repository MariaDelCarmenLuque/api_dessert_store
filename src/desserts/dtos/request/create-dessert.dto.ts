import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateDessertDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Chocolate cake',
    description: 'Dessert name',
  })
  @Length(1, 40)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    example: 'Chocolate cake contains a variety of dried fruits',
    description: 'Dessert description',
  })
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  @ApiProperty({
    example: 1050.5,
    description: 'Dessert Price',
  })
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  @ApiProperty({
    example: 10,
    description: 'Dessert Stock',
  })
  readonly stock: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Id of the Dessert category',
    example: 1,
  })
  readonly categoryId: number;
}
