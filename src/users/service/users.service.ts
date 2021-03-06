import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { getPagination } from '../../utils/pagination.utils';
import { PrismaService } from '../../prisma.service';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { PaginationUserDto } from '../dtos/response/pagination-users.dto';
import { UserDto } from '../dtos/response/user.dto';
import { PaginationOptionsUserDto } from '../dtos/request/pagination-options-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(
    pagination: PaginationOptionsUserDto,
  ): Promise<PaginationUserDto> {
    const { page, take } = pagination;
    const users = await this.prisma.user.findMany({
      skip: take * (page - 1),
      take: take,
      orderBy: { createdAt: 'asc' },
    });
    const totalItems = await this.prisma.user.count();
    const usersResponse = {
      users,
      pagination: getPagination(pagination, totalItems),
    };
    return plainToInstance(PaginationUserDto, usersResponse);
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
