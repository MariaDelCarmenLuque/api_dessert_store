import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LikesModule } from 'src/likes/likes.module';
import { LikesService } from 'src/likes/service/likes.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../prisma.service';
import { DessertsController } from './controller/desserts.controller';
import { DessertsService } from './service/desserts.service';

@Module({
  imports: [AuthModule, ConfigModule, LikesModule],
  controllers: [DessertsController],
  providers: [
    DessertsService,
    PrismaService,
    JwtAuthGuard,
    RolesGuard,
    LikesService,
  ],
  exports: [DessertsService],
})
export class DessertsModule {}
