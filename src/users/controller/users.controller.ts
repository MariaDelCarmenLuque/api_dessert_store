import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { UserDto } from '../dtos/response/user.dto';
import { UsersService } from '../service/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('all')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get data of all Users' })
  async getAll(): Promise<UserDto[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get user by Id',
  })
  @ApiNotFoundResponse({
    description: 'User Not Found',
    schema: {
      example: new NotFoundException('No User found').getResponse(),
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in as Admin',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: new InternalServerErrorException().getResponse(),
    },
  })
  async findOne(@Param('id') id: number): Promise<UserDto> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update data user' })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or ar wrong',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'userName must be a string',
          'userName should not be empty',
          'email must be a string',
          'email must be an email',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in ',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to update data for this user',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  async updateUser(
    @Param('id') id: number,
    @Body() data: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiNotFoundResponse({
    description: 'User Not Found',
    schema: {
      example: new NotFoundException('No User found').getResponse(),
    },
  })
  @ApiBadRequestResponse({
    description: 'User was deleted',
    schema: {
      example: new BadRequestException('User was deleted').getResponse(),
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to delete this product',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }
}
