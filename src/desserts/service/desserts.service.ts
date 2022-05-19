import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Dessert, Prisma, Status } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { PrismaErrorEnum } from '../../utils/enums';
import { CreateDessertDto } from '../models/create-dessert.dto';
import { DessertDto } from '../models/dessert.dto';
import { UpdateDessertDto } from '../models/update-dessert.dto';

@Injectable()
export class DessertsService {
  constructor(private prisma: PrismaService) {}

  async getAllDesserts(): Promise<Dessert[]> {
    const desserts = await this.prisma.dessert.findMany({
      orderBy: { id: 'desc' },
    });
    return desserts;
  }
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

  async findOne(id: number): Promise<Dessert> {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });
      return dessert;
    } catch (error) {
      throw error;
    }
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
    try {
      const oldDessert = await this.prisma.dessert.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });

      if (oldDessert.deletedAt) {
        throw new NotFoundException('Dessert is deleted ');
      }
      if (oldDessert.status == 'DISABLE') {
        throw new UnauthorizedException('Dessert is disable ');
      }
      const dessert = await this.prisma.dessert.update({
        data: {
          ...data,
        },
        where: { id },
      });
      return plainToClass(DessertDto, dessert);
    } catch (error) {
      throw error;
    }
  }
  async deleteDessert(id: number) {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });
      if (dessert.deletedAt != null)
        return new BadRequestException('Dessert is deleted');

      await this.prisma.dessert.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return { message: 'Dessert deleted sucessfully', status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }
  async updateStatus(id: number) {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });
      if (dessert.deletedAt != null)
        return new BadRequestException('Dessert is deleted');
      let newDessert;
      if (dessert.status == Status.ACTIVE) {
        newDessert = await this.prisma.dessert.update({
          data: { ...dessert, status: 'DISABLE' },
          select: { id: true, name: true, status: true, updatedAt: true },
          where: { id: dessert.id },
        });
      }
      if (dessert.status == Status.DISABLE) {
        newDessert = await this.prisma.dessert.update({
          data: { ...dessert, status: 'ACTIVE' },
          where: { id: dessert.id },
        });
      }
      return newDessert;
    } catch (error) {
      throw error;
    }
  }
}
