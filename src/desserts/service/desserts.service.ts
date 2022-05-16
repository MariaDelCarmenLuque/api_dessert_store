import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Dessert, Prisma } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma.service';
import { PrismaErrorEnum } from 'src/utils/enums';
import { CreateDessertDto } from '../models/create-dessert.dto';
import { DessertDto } from '../models/dessert.dto';
import { UpdateDessertDto } from '../models/update-dessert.dto';

@Injectable()
export class DessertsService {
  constructor(private prisma: PrismaService) {}

  async getPaginationList(params: {
    skip?: number;
    take?: number;
    category?: number;
  }): Promise<Dessert[]> {
    const { skip, take, category } = params;

    if (isNaN(skip)) {
      return this.prisma.dessert.findMany({
        take,
        where: { categoryId: category },
      });
    } else {
      return this.prisma.dessert.findMany({
        skip,
        take,
        where: { categoryId: category },
        orderBy: {
          id: 'asc',
        },
      });
    }
  }

  async findOne(id: number): Promise<Dessert | null> {
    const dessert = await this.prisma.dessert.findUnique({
      where: {
        id: id,
      },
      rejectOnNotFound: false,
    });

    return dessert;
  }

  async create(createDessert: CreateDessertDto): Promise<DessertDto> {
    try {
      const { categoryId, ...input } = createDessert;

      const dessert = await this.prisma.dessert.create({
        data: {
          ...input,
          category: {
            connect: {
              id: categoryId,
            },
          },
        },
      });
      return plainToClass(DessertDto, {
        ...dessert,
        images: [],
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFoundException('Category not found');
        }
      }

      throw error;
    }
  }

  async updateDessert(id: number, data: UpdateDessertDto) {
    const oldpProduct = await this.prisma.dessert.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: false,
    });

    if (!oldpProduct) {
      throw new NotFoundException('Product not found');
    }

    if (oldpProduct.deletedAt) {
      throw new UnauthorizedException('Product is deleted ');
    }
    if (oldpProduct.status == 'DISABLE') {
      throw new UnauthorizedException('Product is disable ');
    }
    const dessert = await this.prisma.dessert.update({
      data: {
        ...data,
      },
      where: { id },
    });
    return plainToClass(DessertDto, dessert);
  }
  async deleteDessert(id: number) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return user;
  }
}