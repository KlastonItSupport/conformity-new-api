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
import { IndicatorsService } from '../services/indicators.service';
import { CreateIndicatorDto } from '../dtos/create-indicator-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { PagesParams } from '../dtos/pages-params.dto';

@Controller('indicators')
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll(
    @Query() data: PagesParams,
    @Req() req,
    @Query('departmentId') departmentId,
  ) {
    return await this.indicatorsService.getAll(
      {
        page: data.page ?? 1,
        pageSize: data.pageSize ?? 10,
        search: data.search,
      },
      req.user.companyId,
      departmentId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateIndicatorDto, @Req() req) {
    return await this.indicatorsService.create(data, req.user.companyId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id) {
    return await this.indicatorsService.delete(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id, @Body() data: Partial<CreateIndicatorDto>) {
    return await this.indicatorsService.update(id, data);
  }
}
