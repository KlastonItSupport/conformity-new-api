import { Module } from '@nestjs/common';
import { ReminderService } from './services/reminder.service';
import { ReminderController } from './controllers/reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { Document } from '../documents/entities/document.entity';
import { User } from '../users/entities/users.entity';
import { Evaluators } from '../evaluators/entities/evaluators.entity';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reminder, Document, User, Evaluators]),
    MailerModule,
  ],
  controllers: [ReminderController],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
