import { Body, Controller, Param, Post } from '@nestjs/common';
import { ExternalDataImportService } from '../services/external-data-import.services';

@Controller('import')
export class ExternalDataImportController {
  constructor(
    private readonly externalDataImportServices: ExternalDataImportService,
  ) {}

  @Post('/companies/:id')
  async getCompanies(@Param() param, @Body() data): Promise<any> {
    return this.externalDataImportServices.importData(param.id, {
      email: data.email,
      userId: data.userId,
      defaultPassword: data.defaultPassword,
    });
  }
}
