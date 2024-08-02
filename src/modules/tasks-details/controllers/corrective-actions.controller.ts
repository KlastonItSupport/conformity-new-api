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
import { CorrectiveActionsServices } from '../services/corrective-actions.services';
import { CreateCorrectiveActionsPayload } from '../dtos/create-corrective-actions.payload';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tasks-details/corrective-actions')
export class CorrectiveActionsController {
  constructor(
    private readonly correctiveActionsService: CorrectiveActionsServices,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  createCorrectiveActions(
    @Body() data: CreateCorrectiveActionsPayload,
    @Req() req,
  ) {
    return this.correctiveActionsService.createCorrectiveActions({
      ...data,
      userId: req.user.id,
    });
  }

  @Get(':id')
  async getCorrectiveActions(@Param('id') id: number) {
    return this.correctiveActionsService.getCorrectiveActions(id);
  }

  @Delete(':id')
  async deleteCorrectiveActions(@Param('id') id: number) {
    return this.correctiveActionsService.deleteCorrectiveActions(id);
  }

  @Patch(':id')
  async editCorrectiveActions(
    @Param('id') id: number,
    @Body() data: Partial<CreateCorrectiveActionsPayload>,
  ) {
    return this.correctiveActionsService.editCorrectiveActions(id, data);
  }
}
