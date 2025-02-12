/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { MailerService, SendEmailOptions } from './mailer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailModel } from '../entities/emails.entity';
import { Repository } from 'typeorm';

import { AppError } from 'src/errors/app-error';

Injectable();
export class TemplateService {
  constructor(
    private readonly mailService: MailerService,

    @InjectRepository(EmailModel)
    private readonly emailModelRepository: Repository<EmailModel>,
  ) {}

  async setUpTemplate(templateName: string, values: any, receiverMail: string) {
    const emailModel = await this.emailModelRepository.findOne({
      where: { slug: templateName },
    });
    if (!emailModel) {
      throw new AppError('Template  not found', 404);
    }
    emailModel.body = await this.replacePlaceholders(emailModel.body, values);

    this.mailService.sendEmail({
      to: 'it.support@klaston.com',
      // to: receiverMail,
      subject: emailModel.title,
      html: emailModel.body,
    });
  }

  replacePlaceholders(template: string, context: Record<string, any>): string {
    return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
      const keys = key.split('.');
      let value = context;

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }

      return value !== undefined ? String(value) : `{{${key}}}`;
    });
  }
}
