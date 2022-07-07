import { IsNumber, IsOptional } from 'class-validator';
import { PaginationOptionsDto } from '../../../utils/dtos/request/pagination-options.dto';

export class PaginationOptionsDessertDto extends PaginationOptionsDto {
  /**
   * Category's Id of Dessert
   */
  @IsOptional()
  @IsNumber()
  readonly categoryId?: number = null;
}
