import { Module } from '@nestjs/common';
import { OrdersController } from '../controller/orders.controller';
import { OrdersService } from '../orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
