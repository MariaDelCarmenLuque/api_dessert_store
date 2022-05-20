import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Dessert, Like, User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/roles.enum';
import { CreateDessertDto } from '../models/create-dessert.dto';
import { DessertDto } from '../models/dessert.dto';
import { UpdateDessertDto } from '../models/update-dessert.dto';
import { DessertsService } from '../service/desserts.service';
import { LikesService } from '../../likes/service/likes.service';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { LikeDto } from 'src/likes/models/like.dto';

@ApiTags('Desserts')
@Controller('desserts')
export class DessertsController {
  constructor(
    private dessertsService: DessertsService,
    private likesService: LikesService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all Desserts with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of dessert, search by category ',
    schema: {
      example: {
        items: [
          {
            id: 2,
            uuid: 'ea8314b6-7c5f-44eb-8308-73c6ddbbcc90',
            name: 'Chocolate cake',
            description:
              'A cake with many variety of dried fruits and chocolates',
            price: 250,
            stock: 14,
            status: 'ACTIVE',
            categoryId: 1,
            deletedAt: null,
            updatedAt: '2022-05-17T01:34:30.374Z',
            createdAt: '2022-05-17T01:34:30.372Z',
          },
          {
            id: 1,
            uuid: '5159568b-71d7-4c81-b428-184241963655',
            name: 'Orange cake',
            description: 'A cake with citric fruits',
            price: 100,
            stock: 10,
            status: 'ACTIVE',
            categoryId: 1,
            deletedAt: null,
            updatedAt: '2022-05-17T16:38:07.892Z',
            createdAt: '2022-05-17T16:38:07.889Z',
          },
        ],
      },
    },
  })
  @ApiQuery({
    name: 'category',
    type: 'number',
    description: 'Category ID',
    required: false,
    example: 1,
  })
  async getAllDesserts(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take,
    @Query('skip', new DefaultValuePipe(1), ParseIntPipe) skip,
    @Query('category', new DefaultValuePipe(null), ParseIntPipe)
    category?: number,
  ): Promise<Dessert[]> {
    const params = { take, skip, category };
    return await this.dessertsService.getPaginationList(params);
  }

  @Get('/:id')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a dessert by ID' })
  @ApiResponse({
    status: 200,
    description: 'Dessert found by ID',
    schema: {
      example: {
        id: 1,
        uuid: '5159568b-71d7-4c81-b428-184241963655',
        name: 'Orange cake',
        description: 'A cake with citric fruits',
        price: 100,
        stock: 10,
        status: 'ACTIVE',
        categoryId: 1,
        deletedAt: null,
        updatedAt: '2022-05-17T16:38:07.892Z',
        createdAt: '2022-05-17T16:38:07.889Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Dessert Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Dessert with id 12344 Not found',
      },
    },
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
  async findDessertById(@Param('id') id: number): Promise<Dessert> {
    return await this.dessertsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new Dessert' })
  @ApiBody({
    schema: {
      example: {
        name: 'Banana cake',
        description: 'A cake with banana and chips of chocolates',
        stock: 100,
        price: 200,
        categoryId: 2,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Create a newdessert',
    schema: {
      example: {
        id: 4,
        uuid: '4ae80f89-4f6d-4aeb-80ca-5c6403b74c6a',
        name: 'Banana cake',
        description: 'A cake with banana and chips of chocolates',
        price: 200,
        stock: 100,
        categoryId: 2,
        status: 'ACTIVE',
        images: [],
        updatedAt: '2022-05-17T19:09:16.174Z',
        createdAt: '2022-05-17T19:09:16.172Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category not found',
        error: 'Not Found',
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
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  async createDessert(
    @Body() createDessert: CreateDessertDto,
  ): Promise<DessertDto> {
    return await this.dessertsService.create(createDessert);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update or create a dessert ' })
  @ApiBody({
    schema: {
      example: {
        name: 'Banana cake',
        description: 'A banana cake with chocolate',
      },
    },
    type: UpdateDessertDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Create a new Dessert',
    schema: {
      example: {
        id: 4,
        uuid: '4ae80f89-4f6d-4aeb-80ca-5c6403b74c6a',
        name: 'Banana cake',
        description: 'A cake with banana and chips of chocolates',
        price: 200,
        stock: 100,
        categoryId: 2,
        status: 'ACTIVE',
        images: [],
        updatedAt: '2022-05-17T19:09:16.174Z',
        createdAt: '2022-05-17T19:09:16.172Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Dessert not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Dessert with id 123 Not Found',
        error: 'Not Found',
      },
    },
  })
  @ApiConflictResponse({
    description: 'One or more properties are missing or are wrong',
    schema: {
      example: {
        statusCode: 400,
        message: 'Unexpected token m in JSON at position 18',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Dessert is disable ',
        error: 'Unauthorized',
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
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  async updateDessert(
    @Param('id') id: number,
    @Body() updateDessert: UpdateDessertDto,
  ): Promise<DessertDto> {
    return await this.dessertsService.updateDessert(id, updateDessert);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Dessert deleted sucessfully',
    schema: {
      example: '200',
    },
  })
  @ApiBadRequestResponse({
    status: 200,
    description: 'Dessert deleted sucessfully',
    schema: {
      example: {
        statusCode: 400,
        message: 'Dessert was deleted',
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
    description: 'Dessert not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Dessert with id 123 Not Found',
        error: 'Not Found',
      },
    },
  })
  async delete(@Param('id') id: number) {
    return await this.dessertsService.deleteDessert(id);
  }

  @Patch('/:id/status')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Disable or active a dessert by ID' })
  @ApiResponse({
    status: 200,
    description: 'Update dessert status',
    type: DessertDto,
    schema: {
      example: {
        id: 2,
        name: 'Chocolate cake (update)',
        status: 'DISABLE',
        updatedAt: '2022-05-17T01:34:30.374Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Dessert not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Dessert with id 15 Not found',
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
  async enableStatus(@Param('id') id: number) {
    return await this.dessertsService.updateStatus(id);
  }

  @Get('/:id/likes')
  @Public()
  async findAllLikes(@Param('id') id: number): Promise<Like[]> {
    return await this.likesService.findLikes(id);
  }
  @Patch('/:id/likes')
  @HttpCode(204)
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in',
  })
  async upsertLike(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() likeDto: LikeDto,
  ): Promise<Like> {
    return await this.likesService.upsertLike(user.id, id, likeDto);
  }
  @Delete('/:id/likes')
  @HttpCode(204)
  @Roles(Role.USER, Role.ADMIN)
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteLike(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<boolean> {
    return await this.likesService.delete(user.id, id);
  }
}
