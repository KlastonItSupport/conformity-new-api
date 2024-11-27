import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ReminderService } from '../services/reminder.service';
import { CreateReminderPayload } from '../dtos/create-reminder-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';
@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReminder(
    @Body() body: CreateReminderPayload,
    @Response() res: Res,
  ) {
    const reminder = await this.reminderService.createReminder(body);

    return res
      .set({
        'x-audit-event-complement': `${Number(reminder.module) == 1 ? 'documentos' : 'tarefas'} código #${reminder.key} `,
      })
      .json(reminder);
  }

  // @Get()
  // async getAllReminders() {
  //   return await this.reminderService.getAllReminders();
  // }
  @Get('remind-users')
  async getRemindUsers() {
    return await this.reminderService.sendDocumentReminders();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getDocumentReminder(@Param('id') id: string, @Query() data) {
    return await this.reminderService.getReminder(
      id,
      data.page,
      data.limit,
      data.search,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteReminder(@Param('id') id: number, @Response() res: Res) {
    const deletedReminder = await this.reminderService.deleteReminder(id);
    return res
      .set({
        'x-audit-event-complement': `${Number(deletedReminder.module) == 1 ? 'documentos' : 'tarefas'} código #${deletedReminder.key}`,
      })
      .json(deletedReminder);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateReminder(
    @Param('id') id: number,
    @Body() body: CreateReminderPayload,
    @Response() res: Res,
  ) {
    const updatedReminder = await this.reminderService.updateReminder(id, body);

    return res
      .set({
        'x-audit-event-complement': `${Number(updatedReminder.module) == 1 ? 'documentos' : 'tarefas'} código #${updatedReminder.key}`,
      })
      .json(updatedReminder);
  }
}
