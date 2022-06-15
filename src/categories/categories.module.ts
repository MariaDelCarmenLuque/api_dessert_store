import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoriesController } from './controller/categories.controller';
import { CategoriesResolver } from './resolvers/category.resolver';
import { CategoriesService } from './service/categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, CategoriesResolver],
})
export class CategoriesModule {}
