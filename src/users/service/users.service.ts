import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { PaginationUserDto } from '../dtos/response/pagination-users.dto';
import { UserDto } from '../dtos/response/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(pagination): Promise<PaginationUserDto> {
    try {
      const { page, take } = pagination;
      const users = await this.prisma.user.findMany({
        skip: take * (page - 1),
        take: take,
        orderBy: { createdAt: 'asc' },
      });
      const totalItems = await this.prisma.user.count();
      const totalPages = Math.ceil(totalItems / take);

      if (!totalPages) {
        return plainToInstance(PaginationUserDto, {
          users: [],
          pagination: {
            totalItems,
            totalPages,
            currentPage: 1,
            prevPage: null,
            nextPage: null,
          },
        });
      }
      if (page > totalPages) {
        throw new BadRequestException('Required page is out of range');
      }
      const prevPage = page === 1 ? null : page - 1;
      const nextPage = page === totalPages ? null : page + 1;
      return plainToInstance(PaginationUserDto, {
        users: plainToInstance(UserDto, users),
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          prevPage,
          nextPage,
        },
      });
    } catch (error) {
      throw error;
    }
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
