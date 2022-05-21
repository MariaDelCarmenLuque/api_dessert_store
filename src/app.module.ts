import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DessertsModule } from './desserts/desserts.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { LikesModule } from './likes/likes.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CategoriesModule,
    DessertsModule,
    CartModule,
    LikesModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
