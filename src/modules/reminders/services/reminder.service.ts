import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Reminder } from '../entities/reminder.entity';
import { format } from 'date-fns';
import { CreateReminderPayload } from '../dtos/create-reminder-payload';
import { User } from 'src/modules/users/entities/users.entity';
import { Document } from 'src/modules/documents/entities/document.entity';
import { currentDayName } from 'src/helpers/formats';
import { Evaluators } from 'src/modules/evaluators/entities/evaluators.entity';
import { MailerService } from 'src/modules/mailer/services/mailer.service';
import { AppError } from 'src/errors/app-error';
import { PaginationRemindersDto } from '../dtos/paginated-reminders';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,

    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Evaluators)
    private readonly evaluatorsRepository: Repository<Evaluators>,

    private readonly mailerService: MailerService,
  ) {}

  async createReminder(data: CreateReminderPayload) {
    const reminder = this.reminderRepository.create({
      ...data,
      key: data.key.toString(),
    });
    return await this.reminderRepository.save(reminder);
  }

  async getReminder(
    moduleId: string | number,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const pagination = new PaginationRemindersDto();

    const queryBuilder =
      this.reminderRepository.createQueryBuilder('reminders');

    queryBuilder.where('`reminders`.`key` = :moduleId', {
      moduleId,
    });

    if (search && search.length > 0) {
      const searchParam = `%${search}%`;

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('reminders.frequency LIKE :searchParam', { searchParam })
            .orWhere('reminders.text LIKE :searchParam', { searchParam })
            .orWhere('reminders.status LIKE :searchParam', { searchParam })
            .orWhere('reminders.hour LIKE :searchParam', { searchParam });
        }),
      );
    }

    if (page && limit) {
      queryBuilder.offset((page - 1) * limit).limit(limit);
    }

    const reminders = await queryBuilder.getManyAndCount();
    const totalCategories = reminders[1];
    const lastPage = limit ? Math.ceil(totalCategories / limit) : 1;

    const links = {
      first: 1,
      last: lastPage,
      next: page + 1 > lastPage ? lastPage : page + 1,
      totalPages: limit ? Math.ceil(totalCategories / limit) : 1,
      currentPage: limit ? page : 1,
      previous: limit ? (page > 1 ? page - 1 : 0) : null,
      totalItems: totalCategories,
    };
    pagination.items = reminders[0];
    pagination.pages = links;

    if (moduleId === 'documentos') {
      const document = await this.documentRepository.findOne({
        where: { id: moduleId.toString() },
      });

      pagination.items.forEach((reminder) => {
        reminder['documentName'] = document.name;
      });
    }

    return pagination;
  }

  async sendDocumentReminders() {
    const currentDate = format(
      new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
      'yyyy-MM-dd',
    );
    const currentHour = format(
      new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
      'HH:00',
    );

    const users = [];
    const reminders = await this.reminderRepository.find({
      where: {
        module: 'documentos',
        status: 'ATIVO',
        hour: currentHour,
      },
    });

    for (const reminder of reminders) {
      const documents = await this.documentRepository.find({
        where: {
          id: reminder.key,
          status: 'active',
        },
        relations: ['evaluators', 'evaluators.user'],
      });

      if (documents.length === 0) continue;

      const dateEndReminderWithTimeZone = new Date(reminder.dataEnd);
      const dataEnd = format(
        new Date(
          dateEndReminderWithTimeZone.valueOf() +
            dateEndReminderWithTimeZone.getTimezoneOffset() * 60 * 1000,
        ),
        'yyyy-MM-dd',
      );

      const dateLastReminder = reminder.dateLastReminder
        ? format(new Date(reminder.dateLastReminder), 'yyyy-MM-dd')
        : null;

      const onceReminder =
        reminder.frequency === 'UMA VEZ' &&
        dataEnd === currentDate &&
        dateLastReminder !== currentDate;

      const dailyReminder =
        reminder.frequency === 'DIÁRIA' &&
        dataEnd >= currentDate &&
        dateLastReminder !== currentDate;

      const weeklyReminder =
        reminder.frequency === 'SEMANAL' &&
        reminder.weekDay === currentDayName() &&
        dataEnd >= currentDate &&
        dateLastReminder !== currentDate;

      const monthlyReminder =
        reminder.frequency === 'MENSAL' &&
        (reminder.dateLastReminder === null ||
          new Date().getDate() ===
            new Date(reminder.dateLastReminder).getDate()) &&
        dataEnd >= currentDate &&
        dateLastReminder !== currentDate;

      const yearlyReminder =
        reminder.frequency === 'ANUAL' &&
        (reminder.dateLastReminder === null ||
          (new Date().getDate() ===
            new Date(reminder.dateLastReminder).getDate() &&
            new Date().getMonth() ===
              new Date(reminder.dateLastReminder).getMonth())) &&
        dataEnd >= currentDate &&
        dateLastReminder !== currentDate &&
        reminder.weekDay === currentDayName();

      const shouldSendReminder =
        onceReminder ||
        dailyReminder ||
        weeklyReminder ||
        monthlyReminder ||
        yearlyReminder;

      if (shouldSendReminder) {
        await this.reminderRepository.update(reminder.id, {
          dateLastReminder: new Date(),
        });

        for (const doc of documents) {
          for (const evaluator of doc.evaluators) {
            const user = await this.userRepository.findOne({
              where: { id: evaluator.userId },
            });
            if (user) {
              users.push(user);
              await this.mailerService.sendEmail({
                to: user.email,
                subject: 'Conformity - Lembrete de documento',
                html: 'Lembrete do documento ',
              });
            }
          }
        }
      }
    }
    return users;
  }

  async deleteReminder(id: number) {
    const reminder = await this.reminderRepository.findOne({ where: { id } });
    return await this.reminderRepository.remove(reminder);
  }

  async updateReminder(id: number, body: CreateReminderPayload) {
    const reminder = await this.reminderRepository.findOne({ where: { id } });

    if (!reminder) {
      throw new AppError('Reminder not found', 404);
    }

    const { module, key } = reminder;

    Object.assign(reminder, body, { module, key });

    return await this.reminderRepository.save(reminder);
  }
}
