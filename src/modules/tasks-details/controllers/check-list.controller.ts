import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CheckListServices } from '../services/check-list.services';

@Controller('tasks-details/check-list')
export class CheckListController {
  constructor(private readonly checkListService: CheckListServices) {}

  @Post('')
  async createCheckList(@Body() data) {
    return await this.checkListService.createCheckList(data);
  }

  @Get(':subtaskId')
  async getCheckList(@Param('subtaskId') subtaskId: number) {
    return await this.checkListService.getCheckList(subtaskId);
  }

  @Get('handle-complete-checklist/:checklistId')
  async handleIsCompleted(@Param('checklistId') checklistId: number) {
    return await this.checkListService.handleIsCompleted(checklistId);
  }

  @Delete(':checklistId')
  async deleteCheckList(@Param('checklistId') checklistId: number) {
    return await this.checkListService.deleteCheckList(checklistId);
  }
}
