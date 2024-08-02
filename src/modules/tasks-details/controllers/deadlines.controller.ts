import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeadlinesServices } from '../services/deadlines.services';
import { CreateDeadlinePayload } from '../dtos/create-deadline-payload';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tasks-details/deadlines')
export class DeadlinesController {
  constructor(private readonly deadlinesService: DeadlinesServices) {}

  @UseGuards(AuthGuard)
  @Post()
  createDeadline(@Body() data: CreateDeadlinePayload, @Req() req) {
    return this.deadlinesService.createDeadline({
      ...data,
      userId: req.user.id,
    });
  }

  @Get(':taskId')
  getDeadlines(@Param('taskId') taskId: number) {
    return this.deadlinesService.getDeadlines(taskId);
  }
}
