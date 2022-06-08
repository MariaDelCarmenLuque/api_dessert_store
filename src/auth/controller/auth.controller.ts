import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/request/create-user.dto';
import { ForgotPasswordDto } from '../models/forgot-password.dto';
import { LoginDto } from '../dtos/request/login.dto';
import { ResetPasswordDto } from '../models/reset-password.dto';
import { TokenDto } from '../dtos/response/token.dto';
import { AuthService } from '../service/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiConflictResponse({
    description: 'User is already registered with email',
    schema: {
      example: new ConflictException(
        'User is already registered with email',
      ).getResponse(),
    },
  })
  async register(@Body() user: CreateUserDto) {
    await this.authService.checkEmail(user);
    return await this.authService.createUser(user);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Log in',
  })
  @ApiUnauthorizedResponse({
    description: "Email doesn't exist or Password is incorrect ",
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong',
    schema: {
      example: new BadRequestException(
        'Unexpected token m in JSON at position 18',
      ).getResponse(),
    },
  })
  async login(@Body() input: LoginDto): Promise<TokenDto> {
    return await this.authService.login(input);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Log out',
  })
  @ApiOkResponse({
    description: 'Logout successfuly',
  })
  @ApiBadRequestResponse({
    description: 'Token is invalid',
    schema: { example: new BadRequestException().getResponse() },
  })
  async logout(@Query('token') token: string): Promise<void> {
    return await this.authService.logout(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    await this.authService.sendEmailForgotPassword(data);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    await this.authService.resetPassword(data);
  }
}
