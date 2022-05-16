import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateUserDto } from 'src/users/models/create-user.dto';
import { LoginDto } from '../models/login.dto';
import { TokenDto } from '../models/token.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    await this.authService.checkEmail(user);
    return await this.authService.createUser(user);
  }

  @Post('login')
  async login(@Body() input: LoginDto): Promise<TokenDto> {
    return await this.authService.login(input);
  }

  @Post('logout')
  async logout(@Query('token') token: string): Promise<void> {
    return await this.authService.logout(token);
  }
}
