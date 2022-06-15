import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { CategoryDto } from '../dtos/response/category.dto';
import { CreateCategoryDto } from '../dtos/request/create-category.dto';
import { UpdateCategoryDto } from '../dtos/request/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<CategoryDto[]> {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
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
