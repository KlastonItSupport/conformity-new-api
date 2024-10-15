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
import { CrmServices } from '../services/crm-companies.service';
import { CreateCrmCompanyDto } from '../dtos/create-crm-company.dto';
import { AuthGuard } from 'src/guards/auth.guard';

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
  async create(@Body() data: CreateCrmCompanyDto) {
    return await this.crmServices.create(data);
  }

  @Patch(':id')
  async edit(
    @Param('id') id: number,
    @Body() data: Partial<CreateCrmCompanyDto>,
  ) {
    return await this.crmServices.edit(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.crmServices.delete(id);
  }
}
