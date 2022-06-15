import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToClass, plainToInstance } from 'class-transformer';
import { FilesService } from '../../files/service/files.service';
import { PrismaService } from '../../prisma.service';
import { PrismaErrorEnum } from '../../utils/enums';
import { CreateDessertDto } from '../dtos/request/create-dessert.dto';
import { DessertDto } from '../dtos/response/dessert.dto';
import { ImageDto } from '../dtos/response/image.dto';
import { UpdateDessertDto } from '../dtos/request/update-dessert.dto';

@Injectable()
export class DessertsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async getAllDesserts(): Promise<DessertDto[]> {
    const desserts = await this.prisma.dessert.findMany({
      orderBy: { id: 'desc' },
    });
    return plainToInstance(DessertDto, desserts);
  }
  async getPaginationList(params: {
    skip?: number;
    take?: number;
    category?: number;
  }): Promise<DessertDto[]> {
    const { skip, take, category } = params;
    let desserts;
    if (isNaN(skip)) {
      desserts = await this.prisma.dessert.findMany({
        take,
        where: { categoryId: category },
      });
      return desserts;
    } else {
      desserts = this.prisma.dessert.findMany({
        skip,
        take,
        where: { categoryId: category },
        orderBy: {
          id: 'asc',
        },
      });
      return desserts;
    }
  }

  async findOne(dessertId: number): Promise<DessertDto> {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: {
          id: dessertId,
        },
      });
      return plainToClass(DessertDto, dessert);
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
      });

      if (oldDessert.deletedAt) {
        throw new NotFoundException('Dessert is deleted ');
      }
      if (!oldDessert.status) {
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
      });
      if (dessert.deletedAt)
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
  async updateStatus(id: number): Promise<DessertDto> {
    try {
      const dessert = await this.prisma.dessert.findUnique({
        where: {
          id,
        },
      });
      if (dessert.deletedAt != null) {
        new BadRequestException('Dessert is deleted');
      }
      const previewStatus = dessert.status;
      const newDessert = await this.prisma.dessert.update({
        data: { ...dessert, status: !previewStatus },
        select: { id: true, name: true, status: true, updatedAt: true },
        where: { id: dessert.id },
      });
      return plainToInstance(DessertDto, newDessert);
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
      });
    } catch (error) {
      throw error;
    }
  }
  async getDessertByOrderItemId(orderItemId: number): Promise<DessertDto> {
    return await this.prisma.dessert.findFirst({
      where: { orderItems: { some: { id: orderItemId } } },
    });
  }

  async getImagesByDessertId(dessertId: number) {
    return await this.prisma.dessert.findMany({
      where: { images: { some: { dessertId } } },
    });
  }
}
