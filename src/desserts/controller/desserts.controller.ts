import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/roles.enum';
import { CreateDessertDto } from '../dtos/request/create-dessert.dto';
import { DessertDto } from '../dtos/response/dessert.dto';
import { UpdateDessertDto } from '../dtos/request/update-dessert.dto';
import { DessertsService } from '../service/desserts.service';
import { LikesService } from '../../likes/service/likes.service';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { LikeDto } from 'src/likes/dtos/response/like.dto';
import { ImageDto } from '../dtos/response/image.dto';
import { CreateLikeDto } from 'src/likes/dtos/request/create-like.dto';
import { PaginationDessertDto } from '../dtos/response/pagination-desserts.dto';
import { PaginationOptionsDessertDto } from '../dtos/request/pagination-options-dessert.dto';

@ApiTags('Desserts')
@Controller('desserts')
export class DessertsController {
  constructor(
    private readonly dessertsService: DessertsService,
    private readonly likesService: LikesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all Desserts with optional filters' })
  async getAllDesserts(
    @Query() optionsPagination: PaginationOptionsDessertDto,
  ): Promise<PaginationDessertDto> {
    return await this.dessertsService.getAllDesserts(optionsPagination);
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a dessert by ID' })
  @ApiNotFoundResponse({
    description: 'Dessert Not Found',
    schema: {
      example: new NotFoundException('No Dessert found').getResponse(),
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: new InternalServerErrorException().getResponse(),
    },
  })
  async findDessertById(@Param('id') id: number): Promise<DessertDto> {
    return this.dessertsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new Dessert' })
  @ApiNotFoundResponse({
    description: 'Dessert not found',
    schema: {
      example: new NotFoundException('No Dessert found').getResponse(),
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
      example: new InternalServerErrorException().getResponse(),
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
  @ApiNotFoundResponse({
    description: 'Dessert not found',
    schema: {
      example: new NotFoundException('No Dessert found').getResponse(),
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
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in as Admin',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to update this dessert',
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
  @ApiNotFoundResponse({
    description: 'Dessert not found',
    schema: {
      example: new NotFoundException('No Dessert found').getResponse(),
    },
  })
  @ApiBadRequestResponse({
    status: 200,
    description: 'Dessert deleted sucessfully',
    schema: {
      example: new BadRequestException('Dessert was deleterd').getResponse(),
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
      example: new InternalServerErrorException().getResponse(),
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
  @ApiNotFoundResponse({
    description: 'Dessert not found',
    schema: {
      example: new NotFoundException('No Dessert found').getResponse(),
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in as Admin',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to delete this dessert',
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
  async enableStatus(@Param('id') id: number): Promise<any> {
    return await this.dessertsService.updateStatus(id);
  }

  @Get('/:id/likes')
  @ApiOperation({ summary: 'Get all likes in a dessert' })
  @ApiNotFoundResponse({
    description: 'Dessert not found',
    schema: {
      example: new NotFoundException('No Dessert found').getResponse(),
    },
  })
  async findAllLikes(@Param('id') id: number): Promise<LikeDto[]> {
    return await this.likesService.findLikes(id);
  }
  @Patch('/:id/likes')
  @HttpCode(204)
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create or Update like' })
  @ApiNotFoundResponse({
    description: 'Dessert or User not found',
    schema: {
      example: {
        items: [
          new NotFoundException('No Dessert found').getResponse(),
          new NotFoundException('No User found').getResponse(),
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: new InternalServerErrorException().getResponse(),
    },
  })
  async upsertLike(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() likeDto: CreateLikeDto,
  ): Promise<LikeDto> {
    return await this.likesService.upsertLike(user.id, id, likeDto);
  }
  @Delete('/:id/likes')
  @ApiBearerAuth()
  @HttpCode(204)
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a like in a dessert' })
  @ApiNotFoundResponse({
    description: 'Dessert or User not found',
    schema: {
      example: {
        items: [
          new NotFoundException('No Dessert found').getResponse(),
          new NotFoundException('No User found').getResponse(),
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: new InternalServerErrorException().getResponse(),
    },
  })
  async deleteLike(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<boolean> {
    return await this.likesService.delete(user.id, id);
  }

  @Put('/:id/image')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a image in a dessert' })
  @ApiNotFoundResponse({ description: 'No Dessert found' })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to delete this dessert',
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
  async uploadImage(
    @Param('id') dessertId: number,
    @Body() imageDto: ImageDto,
  ) {
    return await this.dessertsService.createImage(dessertId, imageDto);
  }
}
