import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { PrismaErrorEnum } from '../../utils/enums';
import { LikeDto } from '../models/like.dto';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async findLikes(id: number): Promise<Like[]> {
    const dessert = await this.prisma.dessert.findUnique({
      where: { id: id },
      select: { id: true },
      rejectOnNotFound: false,
    });
    if (!dessert) {
      throw new NotFoundException('No dessert found');
    }
    const likes = await this.prisma.like.findMany({
      where: {
        dessertId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return likes;
  }

  async upsertLike(userId: number, id: number, data: LikeDto): Promise<Like> {
    try {
      const [user, dessert] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { id: true },
          rejectOnNotFound: true,
        }),
        this.prisma.dessert.findUnique({
          where: { id: id },
          select: { id: true },
          rejectOnNotFound: true,
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

      return like;
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
          rejectOnNotFound: true,
        }),
        this.prisma.dessert.findUnique({
          where: { id: id },
          select: { id: true },
          rejectOnNotFound: true,
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
