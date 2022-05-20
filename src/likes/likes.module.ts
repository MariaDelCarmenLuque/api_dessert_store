import { Module } from '@nestjs/common';
import { LikesService } from './service/likes.service';

@Module({
  providers: [LikesService],
})
export class LikesModule {}
