import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DessertsModule } from './desserts/desserts.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { LikesModule } from './likes/likes.module';
import { FilesModule } from './files/files.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CategoriesModule,
    DessertsModule,
    CartModule,
    OrdersModule,
    LikesModule,
    FilesModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
