import { Controller, Get } from '@nestjs/common';

@Controller('companies')
export class CompanyController {
  constructor() {}

  @Get()
  getCompanies() {
    return 'getCompanies';
  }
}
