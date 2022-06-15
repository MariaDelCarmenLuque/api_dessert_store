import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../prisma.service';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtAuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
