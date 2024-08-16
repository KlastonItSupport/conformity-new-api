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
  UseGuards,
} from '@nestjs/common';
import { ActionsService } from '../services/actions.service';
import { CreateEquipmentActionDto } from '../dtos/create-action-payload';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('equipments/actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get(':id')
  async get(@Req() req, @Query() data, @Param() params) {
    return await this.actionsService.get(params.id, {
      page: data.page,
      pageSize: data.pageSize,
      search: data.search,
    });
  }

  @Get('documents/:id')
  async getDocuments(@Param('id') id: number) {
    return await this.actionsService.getDocuments(id);
  }

  @Delete('documents/:id')
  async deleteDocuments(@Param('id') id: number) {
    return await this.actionsService.deleteDocuments(id);
  }

  @UseGuards(AuthGuard)
  @Post('documents/:id')
  async createDocuments(
    @Param('id') id: number,
    @Body() data: any,
    @Req() req,
  ) {
    return await this.actionsService.createAdditionalDocuments(
      id,
      data.documents,
      req.user.companyId,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateEquipmentActionDto, @Req() req) {
    return await this.actionsService.create(data, req.user.companyId);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.actionsService.delete(id);
  }

  @Patch(':id')
  async update(
    @Body() data: Partial<CreateEquipmentActionDto>,
    @Param('id') id: number,
  ) {
    return await this.actionsService.update(id, data);
  }
}
