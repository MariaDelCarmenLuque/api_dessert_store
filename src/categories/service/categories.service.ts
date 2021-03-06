import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { CategoryDto } from '../dtos/response/category.dto';
import { CreateCategoryDto } from '../dtos/request/create-category.dto';
import { UpdateCategoryDto } from '../dtos/request/update-category.dto';
import { PaginationCategoryDto } from '../dtos/response/pagination-categories.dto';
import { getPagination } from '../../utils/pagination.utils';
import { PaginationOptionsCategoryDto } from '../dtos/request/pagination-options-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(
    pagination: PaginationOptionsCategoryDto,
  ): Promise<PaginationCategoryDto> {
    const { page, take } = pagination;
    const categories = await this.prisma.category.findMany({
      skip: take * (page - 1),
      take: take,
      orderBy: { createdAt: 'asc' },
    });
    const totalItems = await this.prisma.category.count();
    const categoriesResponse = {
      categories,
      pagination: getPagination(pagination, totalItems),
    };
    return plainToInstance(PaginationCategoryDto, categoriesResponse);
  }

  async getCategoryByDessert(dessertId: number) {
    return this.prisma.category.findFirst({
      where: { desserts: { some: { id: dessertId } } },
    });
  }

  async findOne(categoryId: number): Promise<CategoryDto | null> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      return category;
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreateCategoryDto): Promise<CategoryDto> {
    try {
      const category = await this.prisma.category.create({ data: data });
      return plainToInstance(CategoryDto, category);
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(
    categoryId: number,
    data: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    try {
      await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      const categoryUpdate = await this.prisma.category.update({
        data: data,
        where: { id: categoryId },
      });
      return plainToInstance(CategoryDto, categoryUpdate);
    } catch (error) {
      throw error;
    }
  }
}
