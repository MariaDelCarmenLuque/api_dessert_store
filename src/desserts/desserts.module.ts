import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DessertsController } from './controller/desserts.controller';
import { DessertsService } from './service/desserts.service';

@Module({
  controllers: [DessertsController],
  providers: [DessertsService, PrismaService],
})
export class DessertsModule {}
