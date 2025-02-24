import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { DeadlinesServices } from '../services/deadlines.services';
import { CreateDeadlinePayload } from '../dtos/create-deadline-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('tasks-details/deadlines')
export class DeadlinesController {
  constructor(private readonly deadlinesService: DeadlinesServices) {}

  @UseGuards(AuthGuard)
  @Post()
  async createDeadline(
    @Body() data: CreateDeadlinePayload,
    @Req() req,
    @Response() res: Res,
  ) {
    const deadline = await this.deadlinesService.createDeadline({
      ...data,
      userId: req.user.id,
    });

    return res
      .set({ 'x-audit-event-complement': deadline.taskId })
      .json(deadline);
  }

  @Get(':taskId')
  getDeadlines(@Param('taskId') taskId: number) {
    return this.deadlinesService.getDeadlines(taskId);
  }
}
