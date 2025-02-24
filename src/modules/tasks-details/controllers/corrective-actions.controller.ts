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
import { CorrectiveActionsServices } from '../services/corrective-actions.services';
import { CreateCorrectiveActionsPayload } from '../dtos/create-corrective-actions.payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('tasks-details/corrective-actions')
export class CorrectiveActionsController {
  constructor(
    private readonly correctiveActionsService: CorrectiveActionsServices,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createCorrectiveActions(
    @Body() data: CreateCorrectiveActionsPayload,
    @Req() req,
    @Response() res: Res,
  ) {
    const correctiveAction =
      await this.correctiveActionsService.createCorrectiveActions({
        ...data,
        userId: req.user.id,
      });

    return res
      .set({ 'x-audit-event-complement': correctiveAction.taskId })
      .json(correctiveAction);
  }

  @Get(':id')
  async getCorrectiveActions(@Param('id') id: number) {
    return this.correctiveActionsService.getCorrectiveActions(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCorrectiveActions(@Param('id') id: number, @Response() res: Res) {
    const correctiveDeleted =
      await this.correctiveActionsService.deleteCorrectiveActions(id);
    return res
      .set({ 'x-audit-event-complement': correctiveDeleted.taskId })
      .json(correctiveDeleted);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async editCorrectiveActions(
    @Param('id') id: number,
    @Body() data: Partial<CreateCorrectiveActionsPayload>,
    @Response() res: Res,
  ) {
    const updatedCorrective =
      await this.correctiveActionsService.editCorrectiveActions(id, data);
    return res
      .set({ 'x-audit-event-complement': updatedCorrective.taskId })
      .json(updatedCorrective);
  }
}
