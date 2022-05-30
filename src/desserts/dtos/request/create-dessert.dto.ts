import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateDessertDto {
  /**
   * Name of Dessert
   * @example 'Chocolate cake'
   */
  @IsNotEmpty()
  @IsString()
  @Length(1, 40)
  readonly name: string;

  /**
   * Description of Dessert
   * @example 'Chocolate cake contains a variety of dried fruits'
   */
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  readonly description: string;

  /**
   * Price of Dessert
   * @example 15.5
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  readonly price: number;

  /**
   * Stock of Dessert
   * @example 10
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  readonly stock: number;

  /**
   * Id of Category
   * @example 5
   */
  @IsNotEmpty()
  @IsNumber()
  readonly categoryId: number;
}
