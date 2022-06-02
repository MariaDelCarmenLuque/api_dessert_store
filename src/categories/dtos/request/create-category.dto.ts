import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  /**
   * Name of category
   * @example 'cake'
   */
  @IsNotEmpty()
  @IsString()
  @Length(1, 40)
  readonly name: string;
}
