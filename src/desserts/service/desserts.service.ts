import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Dessert, Prisma, Status } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { FilesService } from '../../files/service/files.service';
import { PrismaService } from '../../prisma.service';
import { PrismaErrorEnum } from '../../utils/enums';
import { CreateDessertDto } from '../models/create-dessert.dto';
import { DessertDto } from '../models/dessert.dto';
import { ImageDto } from '../models/image.dto';
import { UpdateDessertDto } from '../models/update-dessert.dto';

@Injectable()
export class DessertsService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

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

  async findOne(dessertId: number): Promise<Dessert> {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: {
          id: dessertId,
        },
        rejectOnNotFound: false,
      });
      if (!dessert) {
        throw new NotFoundException('No Dessert found');
      }
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

  async updateDessert(dessertId: number, data: UpdateDessertDto) {
    try {
      const oldDessert = await this.prisma.dessert.findUnique({
        where: {
          id: dessertId,
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
        where: { id: dessertId },
      });
      return plainToClass(DessertDto, dessert);
    } catch (error) {
      throw error;
    }
  }
  async deleteDessert(dessertId: number) {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: {
          id: dessertId,
        },
        rejectOnNotFound: true,
      });
      if (dessert.deletedAt != null)
        return new BadRequestException('Dessert is deleted');

      await this.prisma.dessert.update({
        where: { id: dessertId },
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

  async createImage(dessertId: number, imageDto: ImageDto) {
    try {
      await this.prisma.dessert.findUnique({
        where: {
          id: dessertId,
        },
        select: {
          id: true,
          name: true,
        },
        rejectOnNotFound: true,
      });
      const createImage = await this.prisma.image.create({
        data: { name: imageDto.name, dessertId: dessertId },
      });

      await this.filesService.uploadPublicFile(
        createImage.uuid,
        createImage.name,
      );
      return await this.prisma.dessert.findUnique({
        where: { id: dessertId },
        select: {
          id: true,
          name: true,
          category: { select: { name: true } },
          images: { select: { uuid: true, name: true } },
        },
        rejectOnNotFound: false,
      });
    } catch (error) {
      throw error;
    }
  }
}
