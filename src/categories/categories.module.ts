import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoriesController } from './controller/categories.controller';
import { CategoriesService } from './service/categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
