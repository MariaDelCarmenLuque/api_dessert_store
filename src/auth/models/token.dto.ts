import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Exclude()
export class TokenDto {
  @Expose()
  readonly accessToken: string;

  @Expose()
  readonly exp: number;

  @Expose()
  @IsOptional()
  readonly refreshToken: string;
}
