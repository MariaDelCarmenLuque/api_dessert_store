import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { UserDto } from '../dtos/response/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return plainToInstance(UserDto, users);
  }

  async findOne(id: number): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return plainToInstance(UserDto, user);
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<UserDto> {
    try {
      await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      const user = await this.prisma.user.update({
        data: {
          ...data,
        },
        where: { id },
      });
      return plainToInstance(UserDto, user);
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
