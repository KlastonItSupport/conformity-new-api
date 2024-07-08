import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  constructor(private nestMailerService: NestMailerService) {}

  async sendEmail(to: string, subject: string, html: string) {
    await this.nestMailerService.sendMail({
      to,
      subject,
      html,
      bcc: process.env.EMAIL_USER,
      from: process.env.EMAIL_USER,
    });
  }
}
