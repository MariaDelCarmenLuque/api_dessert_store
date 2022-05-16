import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 40)
  name: string;
}
