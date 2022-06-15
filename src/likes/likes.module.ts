import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../prisma.service';
import { LikesService } from './service/likes.service';

@Module({
  providers: [LikesService, PrismaService, JwtAuthGuard, RolesGuard],
  exports: [LikesService],
})
export class LikesModule {}
