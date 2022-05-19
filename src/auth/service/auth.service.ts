import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';
import { Prisma, Token } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { PrismaErrorEnum } from '../../utils/enums';
import { CreateUserDto } from '../../users/models/create-user.dto';
import { TokenDto } from '../models/token.dto';
import { LoginDto } from '../models/login.dto';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  static prisma: any;
  constructor(private prisma: PrismaService) {}

  async createUser(user: CreateUserDto): Promise<TokenDto> {
    await this.checkEmail(user);

    const encryptedPassword = hashSync(user.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        password: encryptedPassword,
        cart: {
          create: {},
        },
      },
    });
    const token = await this.createToken(newUser.id);
    return await this.generateToken(token.jti);
  }

  async checkEmail(user: CreateUserDto) {
    const userFound = await this.prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
      rejectOnNotFound: false,
    });

    if (userFound) {
      throw new HttpException(
        'User is already registered with email',
        HttpStatus.CONFLICT,
      );
    }
  }

  async login(input: LoginDto): Promise<TokenDto> {
    const userFound = await this.prisma.user.findUnique({
      where: { email: input.email },
      rejectOnNotFound: false,
    });
    if (!userFound) throw new UnauthorizedException("Email doesn't exist ");

    const isValidPassword = compareSync(input.password, userFound.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const token = await this.createToken(userFound.id);

    return this.generateToken(token.jti);
  }

  // validateUser() method for of retrieving a user and verifying the password
  async validateUser(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      rejectOnNotFound: false,
    });
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const userData = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    return userData;
  }

  async createToken(id: number): Promise<Token> {
    try {
      const token = await this.prisma.token.create({
        data: { userId: id },
      });
      return token;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.FOREIGN_KEY_CONSTRAINT:
            throw new NotFoundException('User not found');
          default:
            throw error;
        }
      }
      throw error;
    }
  }
  async generateToken(sub: string): Promise<TokenDto> {
    const accessToken = await this.generateAccessToken(sub);
    const refreshToken = await this.generateRefreshToken(sub);
    const exp = parseInt(process.env.ACCESS_TOKEN_EXPIRATION);
    return {
      accessToken,
      refreshToken,
      exp,
    };
  }
  async generateAccessToken(sub: string) {
    const now = new Date().getTime();
    const exp = Math.floor(
      new Date(now).setSeconds(
        parseInt(process.env.ACCESS_TOKEN_EXPIRATION as string, 10),
      ) / 1000,
    );
    const iat = Math.floor(now / 1000);
    const accessToken = sign(
      {
        sub,
        iat,
        exp,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
    );
    return accessToken;
  }
  async generateRefreshToken(sub: string) {
    const now = new Date().getTime();
    const exp = Math.floor(
      new Date(now).setSeconds(
        parseInt(process.env.REFRESH_TOKEN_EXPIRATION as string, 10),
      ) / 1000,
    );
    const iat = Math.floor(now / 1000);
    const refreshToken = sign(
      {
        sub,
        iat,
        exp,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
    );
    return refreshToken;
  }

  async logout(accessToken: string): Promise<void> {
    if (!accessToken) return;
    try {
      const { sub } = verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
      );

      await this.prisma.token.delete({
        where: {
          jti: sub as string,
        },
      });
    } catch (error) {
      throw new BadRequestException('Token is invalid');
    }
  }
}
