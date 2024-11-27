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
import { ImmediateActionsServices } from '../services/immediate-actions.services';
import { CreateImmediateActionPayload } from '../dtos/create-immediate-action.payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';
@Controller('tasks-details/immediate-actions')
export class ImmediateActionsController {
  constructor(
    private readonly immediateActionsService: ImmediateActionsServices,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createImmediateActions(
    @Body() data: CreateImmediateActionPayload,
    @Req() req,
    @Response() res: Res,
  ) {
    const immediateAction =
      await this.immediateActionsService.createImmediateActions({
        ...data,
        userId: req.user.id,
      });

    return res
      .set({ 'x-audit-event-complement': immediateAction.taskId })
      .json(immediateAction);
  }

  @Get(':id')
  async getImmediateActions(@Param('id') id: number) {
    return this.immediateActionsService.getImmediateActions(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async editImmediateActions(
    @Param('id') id: number,
    @Body() data: Partial<CreateImmediateActionPayload>,
    @Response() res: Res,
  ) {
    const updated = await this.immediateActionsService.editImmediateActions(
      id,
      data,
    );
    return res
      .set({ 'x-audit-event-complement': updated.taskId })
      .json(updated);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteImmediateActions(@Param('id') id: number, @Response() res: Res) {
    const deleted =
      await this.immediateActionsService.deleteImmediateActions(id);
    return res
      .set({ 'x-audit-event-complement': deleted.taskId })
      .json(deleted);
  }
}
