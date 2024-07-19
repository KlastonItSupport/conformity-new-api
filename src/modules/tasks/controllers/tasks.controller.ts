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
import { TasksService } from '../services/tasks.services';
import { CreateTaskDto } from '../dtos/create-task-payload.dto';
import { UpdateTaskDto } from '../dtos/update-task-payload.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(AuthGuard)
  getTasks(@Req() req, @Query() data) {
    return this.tasksService.getTasks(req.user.id, data, {
      status: data?.status,
      origin: data?.origin,
      classification: data?.classification,
      type: data?.type,
      project: data?.project,
      departament: data?.departament,
    });
  }

  @UseGuards(AuthGuard)
  @Post()
  async createTask(@Body() data: CreateTaskDto, @Req() req) {
    return this.tasksService.createTask(
      { ...data, company: req.user.companyId },
      req.user.id,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() data: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.updateTask(id, data, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Req() req) {
    return this.tasksService.deleteTask(id, req.user.id);
  }
}
