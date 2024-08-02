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
import { CreateAdditionalDocumentsDto } from '../dtos/create-additional-document.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(AuthGuard)
  getTasks(@Req() req, @Query() data) {
    return this.tasksService.getTasks(req.user.id, req.user.companyId, data, {
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

  @UseGuards(AuthGuard)
  @Post('additional-documents')
  async createAdditionalDocuments(
    @Body() data: CreateAdditionalDocumentsDto,
    @Req() req,
  ) {
    return this.tasksService.createAdditionalDocuments({
      ...data,
      userId: req.user.id,
      companyId: req.user.companyId,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('additional-documents/:id')
  async deleteAdditionalDocuments(@Param('id') id: string, @Req() req) {
    return this.tasksService.deleteAdditionalDocuments(id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('additional-documents/:taskId')
  async getAdditionalDocuments(@Param('taskId') taskId: string, @Req() req) {
    return this.tasksService.getAdditionalDocuments(taskId, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getTask(@Param('id') id: number, @Req() req) {
    return this.tasksService.getSpecificTask(id, req.user.id);
  }

  @Get('close-task/:id')
  async closeTask(@Param('id') id: number) {
    return this.tasksService.closeTask(id);
  }
}
