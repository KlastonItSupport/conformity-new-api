import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { CreateCompanyDto } from 'src/modules/companies/dtos/dto';
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
  async getCompanies(@Req() req) {
    return await this.companyServices.getCompanies(req.user.id);
  }
}
