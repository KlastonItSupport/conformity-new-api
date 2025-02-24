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
import { CrmServices } from '../services/crm-companies.service';
import { CreateCrmCompanyDto } from '../dtos/create-crm-company.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmServices: CrmServices) {}

  @UseGuards(AuthGuard)
  @Get()
  async getCrmCompanies(@Req() req, @Query() query) {
    return await this.crmServices.getAll(
      {
        page: query.page ?? 1,
        pageSize: 10,
        // pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      req.user.id,
      req.user.companyId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateCrmCompanyDto) {
    return await this.crmServices.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async edit(
    @Param('id') id: number,
    @Body() data: Partial<CreateCrmCompanyDto>,
    @Response() res: Res,
  ) {
    const updated = await this.crmServices.edit(id, data);
    return res
      .set({ 'x-audit-event-complement': `${id}(${updated.socialReason})` })
      .json(updated);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number, @Response() res: Res) {
    const deleted = await this.crmServices.delete(id);
    return res
      .set({ 'x-audit-event-complement': `${id}(${deleted.socialReason})` })
      .json(deleted);
  }
}
