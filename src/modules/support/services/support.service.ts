import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/modules/mailer/services/mailer.service';
import { CreateSupportCase } from '../dtos/create-support-case.dto';
import {
  supportEmailContentTemplate,
  userEmailContentTemplate,
} from '../templates/support-template';

@Injectable()
export class SupportService {
  constructor(private readonly mailerService: MailerService) {}

  async sendSupportEmail(data: CreateSupportCase): Promise<void> {
    try {
      await this.mailerService.sendEmail({
        to: data.userEmail,
        subject: 'Conformity - Recebemos seu contato.',
        html: userEmailContentTemplate(data.userName),
      });

      await this.mailerService.sendEmail({
        to: 'it.support@klaston.com',
        subject: `Suporte - ${data.subject}`,
        html: supportEmailContentTemplate(
          data.userName,
          data.description,
          data.userEmail,
          data.issueDepartment,
          data.priority,
        ),
        attachments: data.attachments,
      });
    } catch (error) {
      throw new Error('Erro ao enviar os e-mails de suporte.');
    }
  }
}
