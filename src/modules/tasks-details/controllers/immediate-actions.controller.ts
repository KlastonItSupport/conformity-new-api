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
import { ImmediateActionsServices } from '../services/immediate-actions.services';
import { CreateImmediateActionPayload } from '../dtos/create-immediate-action.payload';
import { AuthGuard } from 'src/guards/auth.guard';

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
  ) {
    return await this.immediateActionsService.createImmediateActions({
      ...data,
      userId: req.user.id,
    });
  }

  @Get(':id')
  async getImmediateActions(@Param('id') id: number) {
    return this.immediateActionsService.getImmediateActions(id);
  }

  @Patch(':id')
  async editImmediateActions(
    @Param('id') id: number,
    @Body() data: Partial<CreateImmediateActionPayload>,
  ) {
    return this.immediateActionsService.editImmediateActions(id, data);
  }

  @Delete(':id')
  async deleteImmediateActions(@Param('id') id: number) {
    return this.immediateActionsService.deleteImmediateActions(id);
  }
}
