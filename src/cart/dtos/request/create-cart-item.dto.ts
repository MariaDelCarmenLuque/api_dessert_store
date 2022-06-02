import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  /**
   * Id of dessert
   * @example 1
   */
  @IsNumber()
  readonly dessertId: number;

  /**
   * Quantity od Desserts
   * @example 10
   */
  @IsPositive()
  @IsInt()
  readonly quantity: number;
}
