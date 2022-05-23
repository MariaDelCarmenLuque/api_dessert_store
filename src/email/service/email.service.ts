import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }
  async sendMail(mail) {
    const data = {
      ...mail,
      from: this.configService.get<string>('EMAIL_USER'),
    };
    return this.nodemailerTransport.sendMail(data);
  }
}
