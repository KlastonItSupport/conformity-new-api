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
  UseGuards,
} from '@nestjs/common';
import { CreateLeadTaskDto } from '../dtos/create-task-lead.dto';
import { TasksLeadsService } from '../services/tasks-leads.service';
import { AuthGuard } from 'src/guards/auth.guard';

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
    );
  }

  @Get('/:id')
  async getByLeadId(@Param('id') id: number) {
    return await this.tasksLeadsService.getByLeadId(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createTask(@Body() data: CreateLeadTaskDto, @Req() req) {
    return await this.tasksLeadsService.createTask({
      ...data,
      userId: req.user.id,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.tasksLeadsService.delete(id);
  }

  @Patch(':id')
  async edit(@Param('id') id: number, @Body() data: CreateLeadTaskDto) {
    return await this.tasksLeadsService.edit(id, data);
  }
}
