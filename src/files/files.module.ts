import { Module } from '@nestjs/common';
import { FilesService } from './service/files.service';

@Module({
  providers: [FilesService],
})
export class FilesModule {}
