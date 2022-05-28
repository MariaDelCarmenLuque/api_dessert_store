import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from '../dtos/request/login.dto';
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
  @ApiBody({
    schema: {
      example: {
        lastName: 'Luque',
        firstName: 'Maria',
        userName: 'mari',
        email: 'mari@gmail.com',
        password: 'myPa$$w0rd',
        role: 'ADMIN',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created a account successfully',
    type: TokenDto,
  })
  @ApiConflictResponse({
    description: 'User is already registered with email',
    schema: {
      example: {
        statusCode: 409,
        message: 'User is already registered with email',
      },
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
  @ApiBody({
    schema: {
      example: {
        email: 'mari@gmail.com',
        password: 'mypassword',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Login successfully',
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDgxMTM4Zi00ZjQ0LTQwNWQtYTc5OC0xNDY4YWI2MDM5MjUiLCJpYXQiOjE2NTI4MDEyMjEsImV4cCI6MTY1MjgwMjEyMH0.zaTUtg1D7e9CCqaP3P1xhtmOJzqhP4_L9Z2NmD0zBLg',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDgxMTM4Zi00ZjQ0LTQwNWQtYTc5OC0xNDY4YWI2MDM5MjUiLCJpYXQiOjE2NTI4MDEyMjEsImV4cCI6MTY1MjgwMTIyMX0.RIX4Zuuj--jAjFwb5BTedxTVDA9ZQZmdVCojUOfPUFQ',
        exp: 900,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Email doesn't exist or Password is incorrect ",
    schema: {
      example: {
        statusCode: 401,
        message: "Email doesn't exist | Password is incorrect ",
        error: 'Unauthorized',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or are wrong',
    schema: {
      example: {
        statusCode: 400,
        message: 'Unexpected token m in JSON at position 18',
        error: 'Bad Request',
      },
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
  @ApiResponse({
    status: 204,
    description: 'log out successfully',
  })
  @ApiBadRequestResponse({ description: 'Token is invalid' })
  async logout(@Query('token') token: string): Promise<void> {
    return await this.authService.logout(token);
  }
}
