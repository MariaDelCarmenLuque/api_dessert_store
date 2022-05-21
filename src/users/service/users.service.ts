import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UpdateUserDto } from '../models/update-user.dto';
import { User } from '../models/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        lastName: true,
        firstName: true,
        userName: true,
        role: true,
        email: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: true,
    });

    return user;
  }

  async updateUser(id: number, data: UpdateUserDto) {
    try {
      await this.prisma.user.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });
      const user = await this.prisma.user.update({
        data: {
          ...data,
        },
        where: { id },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      });
      if (user.deletedAt != null) {
        return new BadRequestException('User is deleted');
      }
      await this.prisma.user.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return { message: 'User deleted sucessfully', status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }
}
