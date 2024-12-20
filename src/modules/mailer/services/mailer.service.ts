import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any;
}

@Injectable()
export class MailerService {
  constructor(private nestMailerService: NestMailerService) {}

  async sendEmail({
    to,
    subject,
    html,
    attachments,
  }: SendEmailOptions): Promise<void> {
    await this.nestMailerService.sendMail({
      to,
      subject,
      html,
      bcc: process.env.EMAIL_USER,
      from: process.env.EMAIL_USER,
      attachments,
    });
  }
}
