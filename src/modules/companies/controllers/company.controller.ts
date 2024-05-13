import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  CreateCompanyDto,
  PaginationCompanyDto,
} from 'src/modules/companies/dtos/dto';
import { CompanyService } from '../services/company.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyServices: CompanyService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCompany(@Body() data: CreateCompanyDto, @Req() req) {
    return await this.companyServices.createCompany(data, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getCompanies(@Req() req, @Query() data): Promise<PaginationCompanyDto> {
    return await this.companyServices.getCompanies(
      req.user.id,
      data.page,
      data.pageSize,
      data.search,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async editCompany(@Req() req, @Body() data, @Param('id') id: string) {
    return this.companyServices.editCompany(id, data);
  }

  @Get('get-users')
  @UseGuards(AuthGuard)
  async getCompanyUsers(@Req() req) {
    return await this.companyServices.getCompanyUsers(
      req.user.companyId,
      req.user.id,
    );
  }
}
