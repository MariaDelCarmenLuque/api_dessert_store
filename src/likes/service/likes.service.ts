import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { PrismaErrorEnum } from '../../utils/enums';
import { CreateLikeDto } from '../dtos/request/create-like.dto';
import { LikeDto } from '../dtos/response/like.dto';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async findLikes(id: number): Promise<LikeDto[]> {
    await this.prisma.dessert.findUnique({
      where: { id: id },
      select: { id: true },
    });
    const likes = await this.prisma.like.findMany({
      where: {
        dessertId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return plainToInstance(LikeDto, likes);
  }

  async upsertLike(
    userId: number,
    id: number,
    data: CreateLikeDto,
  ): Promise<LikeDto> {
    try {
      const [user, dessert] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { id: true },
        }),
        this.prisma.dessert.findUnique({
          where: { id: id },
          select: { id: true },
        }),
      ]);
      const like = await this.prisma.like.upsert({
        create: {
          ...data,
          user: {
            connect: {
              id: userId,
            },
          },
          dessert: {
            connect: {
              id: id,
            },
          },
        },
        update: {
          ...data,
        },
        where: {
          userId_dessertId: {
            userId: user.id,
            dessertId: dessert.id,
          },
        },
      });

      return plainToClass(LikeDto, like);
    } catch (error) {
      throw error;
    }
  }
  async delete(userId: number, id: number): Promise<boolean> {
    try {
      const [user, dessert] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { id: true },
        }),
        this.prisma.dessert.findUnique({
          where: { id: id },
          select: { id: true },
        }),
      ]);
      await this.prisma.like.delete({
        where: {
          userId_dessertId: {
            userId: user.id,
            dessertId: dessert.id,
          },
        },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFoundException('Like no found');
        }
      }
      throw error;
    }
  }
}
