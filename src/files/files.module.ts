import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from 'aws-sdk';
import { FilesService } from './service/files.service';

@Module({
  providers: [FilesService, ConfigService],
  imports: [ConfigModule],
})
export class FilesModule {}
