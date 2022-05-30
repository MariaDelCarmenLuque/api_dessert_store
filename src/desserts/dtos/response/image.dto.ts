import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ImageDto {
  /**
   * Name of image
   * @example 'imgCake'
   */
  @Expose()
  readonly name: string;
}
