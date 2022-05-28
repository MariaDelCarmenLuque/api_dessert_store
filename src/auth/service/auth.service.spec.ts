import faker from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../../users/dtos/request/create-user.dto';
import { PrismaService } from '../../prisma.service';
import { UserFactory } from '../../users/factories/user.factory';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

jest.spyOn(console, 'error').mockImplementation(jest.fn());
describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let mockUser;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.ACCESS_TOKEN_SECRET,
          signOptions: {
            expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10),
          },
        }),
      ],
      providers: [AuthService, PrismaService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    userFactory = new UserFactory(prisma);
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

  describe('createUser', () => {
    it('should throw a error if email already exist', async () => {
      await userFactory.make({ email: mockUser.email });
      await expect(authService.createUser(mockUser)).rejects.toThrow(
        new BadRequestException('User is already registered with email'),
      );
    });

    it('should create a user successfully', async () => {
      const received = await authService.createUser({ ...mockUser });

      expect(received).toHaveProperty('accessToken', expect.any(String));
      expect(received).toHaveProperty('refreshToken', expect.any(String));
    });
  });
  describe('login', () => {
    it('should throw a error if email doesnt exist', async () => {
      await expect(authService.login(mockUser)).rejects.toThrow(
        new BadRequestException("Email doesn't exist "),
      );
    });
    it('should throw a error if password is incorrect', async () => {
      await authService.createUser({ ...mockUser });
      await expect(
        authService.login({
          email: mockUser.email,
          password: hashSync(faker.internet.password(), 10),
        }),
      ).rejects.toThrow(new UnauthorizedException('Password is incorrect'));
    });
    it('should return token if user login successfully', async () => {
      await authService.createUser({
        ...mockUser,
      });
      const received = await authService.login({
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(received).toHaveProperty('accessToken', expect.any(String));
      expect(received).toHaveProperty('refreshToken', expect.any(String));
    });
  });
  describe('createToken', () => {
    it('should return a token successfully', async () => {
      const createdUser = userFactory.make();
      const result = await authService.createToken((await createdUser).id);
      expect(result).toHaveProperty('jti');
    });

    it("should throw a error if user doesn't exist", async () => {
      await expect(
        authService.createToken(faker.datatype.number()),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });
  });
  describe('logout', () => {
    it('should logout successfully', async () => {
      const createdUser = await userFactory.make();
      const token = await authService.createToken(createdUser.id);
      const value = await authService.generateToken(token.jti);

      expect(await authService.logout(value.accessToken)).toBeUndefined();
    });

    it('should return a error if token is invalid', async () => {
      await expect(authService.logout(faker.datatype.uuid())).rejects.toThrow(
        new UnauthorizedException('Token is invalid'),
      );
    });
  });
  describe('validateUser', () => {
    it('should return data user if user found', async () => {
      const createUser = await userFactory.make({ ...mockUser });
      const received = await authService.validateUser(mockUser.email);
      expect(received).toHaveProperty('id', createUser.id);
      expect(received).toHaveProperty('email', createUser.email);
      expect(received).toHaveProperty('role', createUser.role);
    });

    it('should throw a error if email is invalid', async () => {
      await expect(
        authService.validateUser(faker.internet.email()),
      ).rejects.toThrow(new BadRequestException('No User found'));
    });
  });
});
