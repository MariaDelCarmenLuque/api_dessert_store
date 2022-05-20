import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtAuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
