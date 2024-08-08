import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRelatedTasksPayload } from '../dtos/create-related-tasks.payload';
import { RelatedsServices } from '../services/relateds.services';

@Controller('tasks-details/related-task')
export class RelatedsController {
  constructor(private readonly relatedsService: RelatedsServices) {}

  @Post()
  async createRelateds(@Body() data: CreateRelatedTasksPayload) {
    return this.relatedsService.createRelateds(data);
  }

  @Delete(':id')
  async deleteRelated(@Param('id') id: number) {
    return this.relatedsService.deleteSubtask(id);
  }

  @Get(':id')
  async getRelateds(@Param('id') id: number) {
    return this.relatedsService.getRelateds(id);
  }

  @Get('complete-subtasks/:id')
  async getCompleteSubtasks(@Param('id') id: number) {
    return await this.relatedsService.completeSubtasks(id);
  }

  @Get('uncomplete-subtasks/:id')
  async getUncompleteSubtasks(@Param('id') id: number) {
    return await this.relatedsService.uncompleteSubtasks(id);
  }

  @Get('change-order/:id')
  async changeOrder(@Param('id') id: number, @Query('order') order: number) {
    return await this.relatedsService.changeOrder(id, order);
  }
}
