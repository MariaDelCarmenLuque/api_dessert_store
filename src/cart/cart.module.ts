import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DessertsModule } from 'src/desserts/desserts.module';
import { OrdersService } from 'src/orders/service/orders.service';
import { PrismaService } from 'src/prisma.service';
import { CartController } from './controller/cart.controller';
import { CartService } from './service/cart.service';

@Module({
  imports: [AuthModule, DessertsModule],
  controllers: [CartController],
  providers: [CartService, PrismaService, OrdersService],
})
export class CartModule {}
