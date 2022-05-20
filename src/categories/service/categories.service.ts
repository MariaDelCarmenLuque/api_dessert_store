import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CategoryDto } from '../models/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: true,
    });

    return category;
  }

  async create(data: CategoryDto) {
    try {
      const { name, ...input } = data;
      const category = await this.prisma.category.create({
        data: { ...input, name: name },
      });
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id: number, data: CategoryDto) {
    try {
      await this.prisma.category.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });
      const category = await this.prisma.category.update({
        data: {
          ...data,
        },
        where: { id },
      });
      return category;
    } catch (error) {
      throw error;
    }
  }
}
