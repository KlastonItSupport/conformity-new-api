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
import { ActionsService } from '../services/actions.service';
import { CreateEquipmentActionDto } from '../dtos/create-action-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('equipments/actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async get(@Req() req, @Query() data, @Param() params) {
    return await this.actionsService.get(params.id, {
      page: data.page,
      pageSize: data.pageSize,
      search: data.search,
    });
  }

  @Get('documents/:id')
  @UseGuards(AuthGuard)
  async getDocuments(@Param('id') id: number) {
    return await this.actionsService.getDocuments(id);
  }

  @Delete('documents/:id')
  @UseGuards(AuthGuard)
  async deleteDocuments(@Param('id') id: number, @Response() res: Res) {
    const deleted = await this.actionsService.deleteDocuments(id);
    return res
      .set({ 'x-audit-event-complement': deleted.module })
      .json(deleted);
  }

  @UseGuards(AuthGuard)
  @Post('documents/:id')
  async createDocuments(
    @Param('id') id: number,
    @Body() data: any,
    @Req() req,
    @Response() res: Res,
  ) {
    const documents = await this.actionsService.createAdditionalDocuments(
      id,
      data.documents,
      req.user.companyId,
    );

    return res.set({ 'x-audit-event-complement': id }).json(documents);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() data: CreateEquipmentActionDto,
    @Req() req,
    @Response() res: Res,
  ) {
    const action = await this.actionsService.create(data, req.user.companyId);
    return res
      .set({ 'x-audit-event-complement': action.equipmentId })
      .json(action);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number, @Response() res: Res) {
    const deleted = await this.actionsService.delete(id);
    return res
      .set({
        'x-audit-event-complement': `#${deleted.equipmentId} Código da ação: #${deleted.id}`,
      })
      .json(deleted);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Body() data: Partial<CreateEquipmentActionDto>,
    @Param('id') id: number,
    @Response() res: Res,
  ) {
    const updated = await this.actionsService.update(id, data);

    return res
      .set({
        'x-audit-event-complement': `#${updated.equipmentId} Código da ação:#${updated.id}`,
      })
      .json(updated);
  }
}
