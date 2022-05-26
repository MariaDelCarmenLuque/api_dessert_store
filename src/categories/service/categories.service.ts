import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { CategoryDto } from '../dtos/category.dto';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<CategoryDto[]> {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<CategoryDto | null> {
    try {
      return await this.prisma.category.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });
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
    data: CreateCategoryDto,
  ): Promise<CategoryDto> {
    try {
      await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        rejectOnNotFound: true,
      });
      const category = await this.prisma.category.update({
        data: data,
        where: { id: categoryId },
      });
      return plainToInstance(CategoryDto, category);
    } catch (error) {
      throw error;
    }
  }
}
