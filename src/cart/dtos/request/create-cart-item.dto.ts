import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  @IsNumber()
  readonly dessertId: number;

  @IsPositive()
  @IsInt()
  readonly quantity: number;
}
