import faker from '@faker-js/faker';
import { Like, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AbstractFactory } from '../../utils/factories/abstract.factory';

type LikeInput = Prisma.LikeCreateInput;

export class LikeFactory extends AbstractFactory<Like> {
  constructor(protected prisma: PrismaService) {
    super();
  }

  async make(input: LikeInput): Promise<Like> {
    const like = await this.prisma.like.create({
      data: {
        ...input,
        isLike: input.isLike ?? faker.datatype.boolean(),
        user: input.user,
        dessert: input.dessert,
      },
    });
    return like;
  }

  makeMany(factorial: number, input: LikeInput): Promise<Like[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
