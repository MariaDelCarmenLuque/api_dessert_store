import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Dessert, Prisma, Status } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma.service';
import { PrismaErrorEnum } from 'src/utils/enums';
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

  async findOne(id: number): Promise<Dessert | null> {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: {
          id: id,
        },
        rejectOnNotFound: false,
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
    const oldDessert = await this.prisma.dessert.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: false,
    });

    if (!oldDessert) {
      throw new HttpException(
        `Dessert with id ${id} Not found`,
        HttpStatus.NOT_FOUND,
      );
    }

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
  }
  async deleteDessert(id: number) {
    const dessert = await this.prisma.dessert.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: false,
    });
    if (!dessert) {
      throw new HttpException(
        `Dessert with id ${id} Not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (dessert.deletedAt != null) {
      return new BadRequestException('Dessert was deleted').getResponse();
    } else {
      await this.prisma.dessert.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return { message: 'Dessert deleted sucessfully', status: HttpStatus.OK };
    }
  }
  async updateStatus(id: number) {
    const dessert = await this.prisma.dessert.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: false,
    });
    if (!dessert) {
      throw new HttpException(
        `Dessert with id ${id} Not found`,
        HttpStatus.NOT_FOUND,
      );
    }
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
  }
}
