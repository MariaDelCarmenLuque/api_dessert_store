import faker from '@faker-js/faker';
import { Prisma, Role, User } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { AbstractFactory } from '../../utils/factories/abstract.factory';

type UserInput = Partial<Prisma.UserCreateInput>;

export class UserFactory extends AbstractFactory<User> {
  constructor(protected prisma: PrismaService) {
    super();
  }

  async make(input: UserInput = {}): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...input,
        firstName: input.firstName ?? faker.name.firstName(),
        lastName: input.lastName ?? faker.name.lastName(),
        userName: input.userName ?? faker.internet.userName(),
        email: input.email ?? faker.internet.email(),
        password: hashSync(input.password ?? faker.internet.password(), 10),
        role: input.role ?? Role.USER,
        cart: {
          create: {
            amount: 0,
          },
        },
      },
    });

    return user;
  }

  makeMany(factorial: number, input: UserInput = {}): Promise<User[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
