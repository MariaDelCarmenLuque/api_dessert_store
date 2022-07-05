import {
  Body,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { CategoryDto } from '../dtos/response/category.dto';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto } from '../dtos/request/create-category.dto';
import { PaginationCategoryDto } from '../dtos/response/pagination-categories.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiQuery({
    name: 'take',
    description: 'quantity of items per page',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    description: 'page number',
    required: false,
    example: 1,
  })
  @ApiOperation({ summary: 'Get all categories' })
  async getAll(
    @Query('page', new DefaultValuePipe(10), ParseIntPipe) page?,
    @Query('take', new DefaultValuePipe(1), ParseIntPipe) take?,
  ): Promise<PaginationCategoryDto> {
    const optionsPagination = { page, take };
    return await this.categoriesService.getAll(optionsPagination);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a category filter by Id' })
  @ApiNotFoundResponse({
    description: 'Category Not Found',
    schema: {
      example: new NotFoundException('No Category found').getResponse(),
    },
  })
  async findOne(@Param('id') id: number): Promise<CategoryDto> {
    return await this.categoriesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new Category' })
  @ApiNotFoundResponse({
    description: 'Category Not Found',
    schema: {
      example: new NotFoundException('No Category found').getResponse(),
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in as Admin',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to create a category',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  async createCategory(
    @Body() createCategory: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return await this.categoriesService.create(createCategory);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update a new Category' })
  @ApiNotFoundResponse({
    description: 'Category Not Found',
    schema: {
      example: new NotFoundException('No Category found').getResponse(),
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in as Admin',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to update this category',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  async updateCategory(
    @Param('id') id: number,
    @Body() data: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return await this.categoriesService.updateCategory(id, data);
  }
}
