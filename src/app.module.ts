import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DessertsModule } from './desserts/desserts.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, AuthModule, CategoriesModule, DessertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
