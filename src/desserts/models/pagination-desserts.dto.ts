import { IsOptional } from 'class-validator';
import { PaginationOptions } from 'src/utils/pagination-options.dto';

export class PaginationOptionsDessert extends PaginationOptions {
  @IsOptional()
  category: string = null;
}
