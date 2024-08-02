import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RootCauseServices } from '../services/root-cause.services';
import { CreateRootCausePayload } from '../dtos/create-root-cause.payload';
import { TaskRootCause } from '../entities/root-cause.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tasks-details/root-cause')
export class RootCauseController {
  constructor(private readonly rootCauseService: RootCauseServices) {}

  @UseGuards(AuthGuard)
  @Post()
  async createRootCause(@Body() data: CreateRootCausePayload, @Req() req) {
    return await this.rootCauseService.createRootCause({
      ...data,
      userId: req.user.id,
    });
  }

  @Delete(':id')
  async deleteRootCause(@Param('id') id: number) {
    return await this.rootCauseService.deleteRootCause(id);
  }

  @Patch(':id')
  async editRootCause(
    @Param('id') id: number,
    @Body() data: Partial<TaskRootCause>,
  ) {
    return await this.rootCauseService.editRootCause(id, data);
  }

  @Get(':id')
  async getRootCause(@Param('id') id: number) {
    return await this.rootCauseService.getRootCause(id);
  }
}
