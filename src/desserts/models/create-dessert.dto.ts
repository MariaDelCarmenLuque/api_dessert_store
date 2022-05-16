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
  @Length(1, 40)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
