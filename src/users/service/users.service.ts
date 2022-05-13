import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from '../models/create-user.dto';
import { UpdateUserDto } from '../models/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: false,
    });

    return user;
  }

  async create(user: CreateUserDto) {
    return this.prisma.user.create({
      data: { ...user },
    });
  }
  async updateUser(id: number, data: UpdateUserDto) {
    const user = await this.prisma.user.update({
      data: {
        ...data,
      },
      where: { id },
    });
    return user;
  }

  async delete(id: number) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return user;
  }
}
