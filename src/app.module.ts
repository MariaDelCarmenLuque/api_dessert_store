import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DessertsModule } from './desserts/desserts.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    DessertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
