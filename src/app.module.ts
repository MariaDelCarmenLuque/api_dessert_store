import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DessertsModule } from './desserts/desserts.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { LikesService } from './likes/likes.service';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    CategoriesModule,
    DessertsModule,
    CartModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService, LikesService],
})
export class AppModule {}
