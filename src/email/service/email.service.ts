import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      // service: configService.get(process.env.EMAIL_SERVICE),
      secure: true,
      port: 2525,
      service: 'gmail',
      auth: {
        // user: configService.get(process.env.EMAIL_USER),
        // pass: configService.get(process.env.EMAIL_PASSWORD),
        user: 'api.dessert.store@gmail.com',
        pass: '976431api*',
      },
    });
  }
  async sendMail(mail) {
    const data = {
      ...mail,
      from: mail,
    };
    return this.nodemailerTransport.sendMail(data);
  }
}
