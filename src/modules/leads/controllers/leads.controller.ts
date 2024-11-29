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
import { LeadsService } from '../services/leads.service';
import { CreateLeadDto } from '../dtos/create-lead-payload.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async get(@Req() req, @Query() query) {
    return await this.leadsService.getAll(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      req.user.id,
      req.user.companyId,
    );
  }

  @Get('/status')
  @UseGuards(AuthGuard)
  async getLeadPerStatus(@Req() req) {
    return await this.leadsService.getLeadPerStatus(
      req.user.id,
      req.user.companyId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateLeadDto, @Req() req) {
    return await this.leadsService.create({
      ...data,
      userId: req.user.id,
      companyId: req.user.companyId,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    return await this.leadsService.delete(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async edit(@Param('id') id: number, @Body() data: Partial<CreateLeadDto>) {
    return await this.leadsService.edit(id, data);
  }
}
