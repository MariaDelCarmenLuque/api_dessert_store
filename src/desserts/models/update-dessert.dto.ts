import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UpdateDessertDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  stock?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
