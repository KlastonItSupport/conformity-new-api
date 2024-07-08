// import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common/decorators';

import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [
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

  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
