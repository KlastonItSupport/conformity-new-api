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
import { EquipmentsService } from '../services/equipments.service';
import { CreateEquipmentDto } from '../dtos/create-equipment-payload';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(@Req() req, @Query() data) {
    return await this.equipmentsService.get(req.user.companyId, {
      page: data.page,
      pageSize: data.pageSize,
      search: data.search,
    });
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateEquipmentDto, @Req() req) {
    return await this.equipmentsService.create({
      ...data,
      companyId: req.user.companyId,
    });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Body() data: Partial<CreateEquipmentDto>,
    @Param('id') id: number,
    @Req() req,
  ) {
    return await this.equipmentsService.update(id, {
      ...data,
      companyId: req.user.companyId,
    });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number) {
    return await this.equipmentsService.delete(id);
  }
}
