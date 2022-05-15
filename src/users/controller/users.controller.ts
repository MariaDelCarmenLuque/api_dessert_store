import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../models/create-user.dto';
import { UpdateUserDto } from '../models/update-user.dto';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('all')
  async getAll() {
    return await this.userService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() data: UpdateUserDto) {
    return await this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }
}
