import { IsNumber, IsOptional } from 'class-validator';

export class PaginationOptionsDto {
  /**
   * Quantity of item per page
   */
  @IsOptional()
  @IsNumber()
  take?: number = 10;

  /**
   * Number of page
   */
  @IsOptional()
  @IsNumber()
  page?: number = 1;
}
