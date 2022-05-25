import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'token to verify user', example: 'TOKEN' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'New password of user',
    example: faker.internet.password(),
  })
  @MinLength(8, {
    message: 'PASSWORD_MIN_LENGTH: 8',
  })
  @MaxLength(16, {
    message: 'PASSWORD_MAX_LENGTH: 16',
  })
  @Matches(/\d/, {
    message: 'PASSWORD_MISSING: NUMBER',
  })
  @Matches(/[A-Z]/, {
    message: 'PASSWORD_MISSING: UPPER_CASE_LETTER',
  })
  @Matches(/[a-z]/, {
    message: 'PASSWORDS_MISSING: LOWER_CASE_LETTER',
  })
  @Matches(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, {
    message: 'PASSWORDS_MISSING: SPECIAL_CHARACTER',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  readonly password: string;
}
