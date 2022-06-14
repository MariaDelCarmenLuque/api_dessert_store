import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createTransport } from 'nodemailer';
import * as SendGrid from '@sendgrid/mail';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }
  async sendMail(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail);
    console.log(`E-Mail sent to ${mail.to}`);
    return transport;
  }
}
