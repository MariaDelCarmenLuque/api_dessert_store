import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PrismaService } from 'src/prisma.service';
import { DessertsController } from './controller/desserts.controller';
import { DessertsService } from './service/desserts.service';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [DessertsController],
  providers: [DessertsService, PrismaService, JwtAuthGuard, RolesGuard],
  exports: [DessertsService],
})
export class DessertsModule {}
