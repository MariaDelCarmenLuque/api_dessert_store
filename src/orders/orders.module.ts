import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DessertsModule } from 'src/desserts/desserts.module';
import { PrismaService } from 'src/prisma.service';
import { OrdersController } from './controller/orders.controller';
import { OrdersResolver } from './resolvers/order.resolver';
import { OrdersService } from './service/orders.service';

@Module({
  imports: [DessertsModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, OrdersResolver],
})
export class OrdersModule {}
