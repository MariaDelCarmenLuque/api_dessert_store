import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User Email',
    example: faker.internet.email(),
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
