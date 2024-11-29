import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateLeadTaskDto } from '../dtos/create-task-lead.dto';
import { TasksLeadsService } from '../services/tasks-leads.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('leads/tasks')
export class TasksLeadsController {
  constructor(private readonly tasksLeadsService: TasksLeadsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Req() req, @Query() query) {
    return await this.tasksLeadsService.getAll(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      req.user.id,
      req.user.companyId,
      query.leadId,
    );
  }

  @Get('/:id')
  async getByLeadId(@Param('id') id: number) {
    return await this.tasksLeadsService.getByLeadId(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createTask(
    @Body() data: CreateLeadTaskDto,
    @Req() req,
    @Response() res: Res,
  ) {
    const taskLead = await this.tasksLeadsService.createTask({
      ...data,
      userId: req.user.id,
    });

    return res
      .set({ 'x-audit-event-complement': taskLead.leadId })
      .json(taskLead);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number, @Response() res: Res) {
    const deleted = await this.tasksLeadsService.delete(id);
    return res
      .set({ 'x-audit-event-complement': deleted.leadId })
      .json(deleted);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async edit(
    @Param('id') id: number,
    @Body() data: CreateLeadTaskDto,
    @Response() res: Res,
  ) {
    const updated = await this.tasksLeadsService.edit(id, data);
    return res
      .set({ 'x-audit-event-complement': updated.leadId })
      .json(updated);
  }
}
