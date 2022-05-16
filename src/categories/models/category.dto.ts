import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 40)
  name: string;
}
