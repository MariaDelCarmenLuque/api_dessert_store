import faker from '@faker-js/faker';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma.service';
import { UserFactory } from '../factories/user.factory';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  let mockUser;
  let users: User[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    userFactory = new UserFactory(prisma);
    users = await userFactory.makeMany(5);
  });
  beforeEach(() => {
    mockUser = plainToInstance(CreateUserDto, {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.internet.userName(),
      email: faker.internet.email(),
      password: hashSync(faker.internet.password(), 10),
      role: Role.USER,
    });
  });
  afterAll(async () => {
    await prisma.clearDB();
    await prisma.$disconnect();
  });
  describe('getAll', () => {
    it('should return a list of all user', async () => {
      const received = await usersService.getAll();
      expect(received.length).toEqual(users.length);
    });
  });
  describe('findOne', () => {
    it('should return a user find by Id', async () => {
      const createdUser = await prisma.user.create({
        data: {
          ...mockUser,
          email: faker.internet.email(),
        },
      });

      const result = await usersService.findOne(createdUser.id);

      expect(result).toHaveProperty('id', createdUser.id);
      expect(result).toHaveProperty('uuid', createdUser.uuid);
      expect(result).toHaveProperty('firstName', createdUser.firstName);
      expect(result).toHaveProperty('lastName', createdUser.lastName);
      expect(result).toHaveProperty('email', createdUser.email);
    });

    it('should throw a error if user not found', async () => {
      const id = faker.datatype.number();
      await expect(usersService.findOne(id)).rejects.toThrow(
        new NotFoundException(`No User found`),
      );
    });
  });
  describe('updateUser', () => {
    it('should update data user and return a user properties  ', async () => {
      const createdUser = await prisma.user.create({
        data: {
          ...mockUser,
        },
      });
      const data = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        userName: 'newUserName',
      };
      const received = await usersService.updateUser(
        createdUser.id,
        plainToClass(UpdateUserDto, data),
      );
      expect(received).toHaveProperty('firstName', data.firstName);
      expect(received).toHaveProperty('lastName', data.lastName);
      expect(received).toHaveProperty('userName', data.userName);
    });

    it('should throw a error if the user doesnt exist', async () => {
      const data = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        userName: 'newUserName',
      };
      await expect(
        usersService.updateUser(
          faker.datatype.number(),
          plainToClass(UpdateUserDto, data),
        ),
      ).rejects.toThrow(new NotFoundException('No User found'));
    });
  });
  describe('delete', () => {
    it('should delete user successfully', async () => {
      const createdUser = await prisma.user.create({
        data: {
          ...mockUser,
          email: faker.internet.email(),
        },
      });
      await expect(usersService.delete(createdUser.id)).resolves.toEqual({
        message: 'User deleted sucessfully',
        status: HttpStatus.OK,
      });
    });

    it('should throw a error if user not found', async () => {
      const id = faker.datatype.number();
      await expect(usersService.delete(id)).rejects.toThrow(
        new NotFoundException(`No User found`),
      );
    });
    it('should throw a error if user is deleted', async () => {
      const received = await userFactory.make({
        deletedAt: new Date(),
      });
      await expect(usersService.delete(received.id)).resolves.toThrow(
        new BadRequestException('User is deleted'),
      );
    });
  });
});
