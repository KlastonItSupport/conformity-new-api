import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { RootCauseServices } from '../services/root-cause.services';
import { CreateRootCausePayload } from '../dtos/create-root-cause.payload';
import { TaskRootCause } from '../entities/root-cause.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';
@Controller('tasks-details/root-cause')
export class RootCauseController {
  constructor(private readonly rootCauseService: RootCauseServices) {}

  @UseGuards(AuthGuard)
  @Post()
  async createRootCause(
    @Body() data: CreateRootCausePayload,
    @Req() req,
    @Response() res: Res,
  ) {
    const rootCause = await this.rootCauseService.createRootCause({
      ...data,
      userId: req.user.id,
    });

    return res
      .set({ 'x-audit-event-complement': rootCause.taskId })
      .json(rootCause);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteRootCause(@Param('id') id: number, @Response() res: Res) {
    const rootCause = await this.rootCauseService.deleteRootCause(id);

    return res
      .set({ 'x-audit-event-complement': rootCause.taskId })
      .json(rootCause);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async editRootCause(
    @Param('id') id: number,
    @Body() data: Partial<TaskRootCause>,
    @Response() res: Res,
  ) {
    const updated = await this.rootCauseService.editRootCause(id, data);
    return res
      .set({ 'x-audit-event-complement': updated.taskId })
      .json(updated);
  }

  @Get(':id')
  async getRootCause(@Param('id') id: number) {
    return await this.rootCauseService.getRootCause(id);
  }
}
