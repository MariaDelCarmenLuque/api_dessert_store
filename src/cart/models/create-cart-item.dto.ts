import { IsInt, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCartItemDto {
  @IsNumber()
  dessertId: number;

  @IsPositive()
  @IsInt()
  quantity: number;
}
