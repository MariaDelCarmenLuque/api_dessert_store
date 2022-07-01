import { IsNumber, IsOptional } from 'class-validator';

export class PaginationOptionsDessertDto {
  /**
   * Number of page
   */
  @IsOptional()
  @IsNumber()
  readonly page?: number = 1;

  /**
   * Quantity of desserts per page
   */
  @IsOptional()
  @IsNumber()
  readonly take?: number = 10;

  /**
   * Category's Id of Dessert
   */
  @IsOptional()
  @IsNumber()
  readonly categoryId?: number = null;
}
