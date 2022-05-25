import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Exclude()
export class TokenDto {
  @Expose()
  @ApiProperty({
    description: 'Access token of user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMTYxMTQ2NC0wNDhhLTRhZjMtOTU0OS0zOTA1MWRmZTFkMzIiLCJpYXQiOjE2NTI4MjA2NTksImV4cCI6MTY1MjgyMTUwMH0.F603fXj5WlLrtYRjiJRpZVQwaLZKunswJ_IT_DGF7ZY',
  })
  readonly accessToken: string;

  @ApiProperty({
    description: 'Expiration date of access token',
    example: 900,
  })
  @Expose()
  readonly exp: number;

  @ApiProperty({
    description: 'Refresh token of user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMTYxMTQ2NC0wNDhhLTRhZjMtOTU0OS0zOTA1MWRmZTFkMzIiLCJpYXQiOjE2NTI4MjA2NTksImV4cCI6MTY1MjgyMDYwMX0._bCLNC0DA8fs1kimUe1djSbh585MH9ejNFo5fiYAkLU',
  })
  @Expose()
  @IsOptional()
  readonly refreshToken: string;
}
