import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CategoryDto } from '../dtos/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Category | null> {
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

  async create(data: CategoryDto) {
    try {
      return await this.prisma.category.create({ data: data });
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(categoryId: number, data: CategoryDto) {
    try {
      await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        rejectOnNotFound: true,
      });
      return await this.prisma.category.update({
        data: data,
        where: { id: categoryId },
      });
    } catch (error) {
      throw error;
    }
  }
}
