import { PrismaService } from 'src/prisma.service';

export abstract class AbstractFactory<T> {
  protected abstract readonly prisma: PrismaService;

  abstract make(input?: unknown): Promise<T>;
  abstract makeMany(factorial: number, input: unknown): Promise<T[]>;
}
