import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { CategoryDto } from '../dtos/category.dto';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('all')
  @Public()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of all dessert orderBy asc',
    type: [CategoryDto],
  })
  async getAll(): Promise<CategoryDto[]> {
    return await this.categoriesService.getAll();
  }

  @Get('/:id')
  @Public()
  @ApiOperation({ summary: 'Get a category filter by Id' })
  @ApiResponse({
    status: 200,
    description: 'Category found by ID',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Category Not Found',
    schema: {
      example: new NotFoundException(
        'Category with id xxx Not found',
      ).getResponse(),
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
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Category Not Found',
    schema: {
      example: new NotFoundException(
        'Category with id xxx Not found',
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
  @ApiResponse({
    status: 201,
    description: 'Category update successfully',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Category Not Found',
    schema: {
      example: new NotFoundException(
        'Category with id xxx Not found',
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
