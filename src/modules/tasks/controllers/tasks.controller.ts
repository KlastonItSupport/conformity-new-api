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
import { TasksService } from '../services/tasks.services';
import { CreateTaskDto } from '../dtos/create-task-payload.dto';
import { UpdateTaskDto } from '../dtos/update-task-payload.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateAdditionalDocumentsDto } from '../dtos/create-additional-document.dto';
import { Response as Res } from 'express';

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
      projectId: data?.projectId,
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
    @Response() res: Res,
  ) {
    const updatedTask = await this.tasksService.updateTask(
      id,
      data,
      req.user.id,
    );
    return res
      .set({ 'x-audit-event-complement': updatedTask.title })
      .json(updatedTask);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Req() req, @Response() res: Res) {
    const deletedTask = await this.tasksService.deleteTask(id, req.user.id);

    return res
      .set({ 'x-audit-event-complement': deletedTask.title })
      .json(deletedTask);
  }

  @UseGuards(AuthGuard)
  @Post('additional-documents')
  async createAdditionalDocuments(
    @Body() data: CreateAdditionalDocumentsDto,
    @Req() req,
    @Response() res: Res,
  ) {
    const additional = await this.tasksService.createAdditionalDocuments({
      ...data,
      userId: req.user.id,
      companyId: req.user.companyId,
    });

    return res
      .set({
        'x-audit-event-complement': data.taskId,
      })
      .json(additional);
  }

  @UseGuards(AuthGuard)
  @Delete('additional-documents/:id')
  async deleteAdditionalDocuments(
    @Param('id') id: string,
    @Req() req,
    @Response() res: Res,
  ) {
    const attachment = await this.tasksService.deleteAdditionalDocuments(
      id,
      req.user.id,
    );
    return res
      .set({
        'x-audit-event-complement': `${id}(${attachment.name}) da tarefa #${attachment.module}`,
      })
      .json(attachment);
  }

  @UseGuards(AuthGuard)
  @Get('additional-documents/:taskId')
  async getAdditionalDocuments(@Param('taskId') taskId: string, @Req() req) {
    return this.tasksService.getAdditionalDocuments(taskId, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getTask(@Param('id') id: number, @Req() req, @Response() res: Res) {
    const task = await this.tasksService.getSpecificTask(id, req.user.id);
    return res.set({ 'x-audit-event-complement': task.title }).json(task);
  }

  @UseGuards(AuthGuard)
  @Get('close-task/:id')
  async closeTask(@Param('id') id: number, @Response() res: Res) {
    const task = await this.tasksService.closeTask(id);
    return res
      .set({
        'x-audit-event-complement':
          task.status === 'Aberta' ? 'Abriu' : 'Fechou',
      })
      .json(task);
  }

  @Get('permission/:id')
  @UseGuards(AuthGuard)
  async getTaskPermission(@Req() req, @Param('id') id: string) {
    console.log('=== Task Permission Check Started ===');
    console.log('Request received for task:', id);
    console.log('User:', req.user);

    try {
      console.log('Permission check initiated:', {
        taskId: id,
        userId: req.user.id,
        companyId: req.user.companyId,
      });

      const task = await this.tasksService.getSpecificTask(
        Number(id),
        req.user.id,
      );
      console.log('Task found:', !!task);

      if (!task) {
        console.log('Task not found');
        return {
          isAllowed: false,
          message: 'Task not found',
        };
      }

      console.log('Access granted for task:', id);
      return {
        isAllowed: true,
        message: 'Access granted',
      };
    } catch (error) {
      console.error('Task Permission Check Error:', error);
      return {
        isAllowed: false,
        message: 'Error checking permissions',
      };
    } finally {
      console.log('=== Task Permission Check Ended ===');
    }
  }
}
