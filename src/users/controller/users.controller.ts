import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../dtos/user.dto';
import { UsersService } from '../service/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('all')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get data of all Users',
  })
  @ApiOkResponse({
    schema: {
      example: {
        items: [
          {
            id: 1,
            lastName: 'luque',
            firstName: 'maria',
            userName: 'maritcarmn',
            role: 'ADMIN',
            email: 'mari@gmail.com',
            deletedAt: '2022-05-16T13:46:02.287Z',
            createdAt: '2022-05-13T02:07:49.123Z',
            updatedAt: '2022-05-16T13:46:02.289Z',
          },
          {
            id: 2,
            lastName: 'My lastName',
            firstName: 'My firstName',
            userName: 'My userName',
            role: 'USER',
            email: 'email@gmail.com',
            deletedAt: null,
            createdAt: '2022-05-16T01:21:22.600Z',
            updatedAt: '2022-05-16T01:21:22.606Z',
          },
          {
            id: 3,
            lastName: 'My lastName2',
            firstName: 'My firstName2',
            userName: 'My userName2',
            role: 'ADMIN',
            email: 'email@gmail.com',
            deletedAt: null,
            createdAt: '2022-05-16T01:23:40.324Z',
            updatedAt: '2022-05-16T01:23:40.325Z',
          },
        ],
      },
    },
  })
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get user by Id',
  })
  @ApiOkResponse({
    schema: {
      example: {
        id: 1,
        lastName: 'luque',
        firstName: 'maria',
        userName: 'maritcarmn',
        role: 'ADMIN',
        email: 'mari@gmail.com',
        deletedAt: '2022-05-16T13:46:02.287Z',
        createdAt: '2022-05-13T02:07:49.123Z',
        updatedAt: '2022-05-16T13:46:02.289Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User Not Found',
      },
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
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number,
    required: true,
    example: 1,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  async findOne(@Param('id') id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update data user',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Data of User Logged',
    schema: {
      example: {
        id: 3,
        uuid: 'c4730bd4-d995-49ee-8b69-0b5474ab44c5',
        firstName: 'My firstName',
        lastName: 'My lastName',
        userName: ' My username',
        email: 'email@gmail.com',
        password:
          '$2a$10$dPDvwAijLW3Km6d5H4l7nOcrb3o6RJpS0g2aZja8NDzX.J.aAsmeq',
        role: 'ADMIN',
        deletedAt: null,
        updatedAt: '2022-05-17T21:47:50.878Z',
        createdAt: '2022-05-16T01:23:40.324Z',
      },
    },
  })
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
    description: 'User is not logged in',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to delete this product',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  @ApiBody({
    schema: {
      example: {
        firstName: 'My firstName',
        lastName: 'My lastName',
        userName: ' My username',
        email: 'mi-email@gmail.com',
        role: 'ADMIN',
      },
    },
    type: UpdateUserDto,
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number,
    required: true,
    example: 1,
  })
  async updateUser(@Param('id') id: number, @Body() data: UpdateUserDto) {
    return await this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Delete a user',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Delete a user sucessfully',
    schema: {
      example: {
        message: 'Delete sucessfully',
        status: 200,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'One or more properties are missing or ar wrong',
    schema: {
      example: {
        statusCode: 400,
        message: 'Users was deleted',
        error: 'Bad Request',
      },
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
  @ApiNotFoundResponse({
    description: 'User Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id 555555 Not found',
        error: 'Not Found',
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number,
    required: true,
    example: 1,
  })
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }
}
