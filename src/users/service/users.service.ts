import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
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
    const user = await this.prisma.user.update({
      data: {
        ...data,
      },
      where: { id },
    });
    return user;
  }

  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      rejectOnNotFound: false,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} Not found`);
    }
    if (user.deletedAt == null) {
      await this.prisma.user.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return { message: 'Delete user sucessfully', status: HttpStatus.OK };
    } else {
      return new BadRequestException('Users was deleted').getResponse();
    }
  }
}
