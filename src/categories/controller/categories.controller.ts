import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
  @ApiResponse({
    status: 200,
    description: 'Return a list of all dessert orderBy asc',
    schema: {
      example: {
        items: [
          {
            id: 1,
            name: 'cakes',
          },
          {
            id: 2,
            name: 'cupcakes',
          },
          {
            id: 3,
            name: 'cheesecake',
          },
          {
            id: 4,
            name: 'cookies',
          },
          {
            id: 5,
            name: 'brownies',
          },
          {
            id: 6,
            name: 'cream',
          },
        ],
      },
    },
  })
  async getAll(): Promise<CategoryDto[]> {
    return await this.categoriesService.getAll();
  }

  @Get('/:id')
  @Public()
  @ApiOperation({ description: 'Return a dessert filter by Id' })
  @ApiResponse({
    status: 200,
    description: 'Category found by ID',
    type: CategoryDto,
    // schema: {
    //   example: {
    //     id: 5,
    //     name: 'Brownies',
    //   },
    // },
  })
  @ApiNotFoundResponse({
    description: 'Product Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Category with id 11111 Not found',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param('id') id: number): Promise<CategoryDto> {
    const user = await this.categoriesService.findOne(id);
    if (!user) {
      throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
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
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in as Manager',
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
  async updateUser(
    @Param('id') id: number,
    @Body() data: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return await this.categoriesService.updateCategory(id, data);
  }
}
