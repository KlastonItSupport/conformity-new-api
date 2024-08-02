import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReminderService } from '../services/reminder.service';
import { CreateReminderPayload } from '../dtos/create-reminder-payload';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  async createReminder(@Body() body: CreateReminderPayload) {
    return await this.reminderService.createReminder(body);
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
  async deleteReminder(@Param('id') id: number) {
    return await this.reminderService.deleteReminder(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateReminder(
    @Param('id') id: number,
    @Body() body: CreateReminderPayload,
  ) {
    return await this.reminderService.updateReminder(id, body);
  }
}
