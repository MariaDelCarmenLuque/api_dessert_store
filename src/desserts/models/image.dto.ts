import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ImageDto {
  @Expose()
  name: string;
}
