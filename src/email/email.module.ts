import { Module } from '@nestjs/common';
import { ConfigService } from 'aws-sdk';
import { EmailService } from './service/email.service';

@Module({
  providers: [EmailService, ConfigService],
})
export class EmailModule {}
