// import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common/decorators';

import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './services/mailer.service';
import { TemplateService } from './services/template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModel } from './entities/emails.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailModel]),
    ConfigModule.forRoot(),
    NestMailerModule.forRoot({
      transport: {
        host: 'smtp.hostinger.com',
        secure: true,
        port: 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        ignoreTLS: true,
      },
      defaults: {
        from: '"',
      },
    }),
  ],

  providers: [MailerService, TemplateService],
  exports: [MailerService, TemplateService],
})
export class MailerModule {}
