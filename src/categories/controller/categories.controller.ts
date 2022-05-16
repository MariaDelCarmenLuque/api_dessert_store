import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from '../models/update-category.dto';
import { CategoriesService } from '../service/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('all')
  async getAll() {
    return await this.categoriesService.getAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    const user = await this.categoriesService.findOne(id);
    if (!user) {
      throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  async createCategory(
    @Body() createCategory: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategory);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: number, @Body() data: UpdateCategoryDto) {
    return await this.categoriesService.updateCategory(id, data);
  }
}
