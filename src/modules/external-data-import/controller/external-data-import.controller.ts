import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExternalDataImportService } from '../services/external-data-import.services';
import { DocumentsImportService } from '../services/documents-import.services';

@Controller('import')
export class ExternalDataImportController {
  constructor(
    private readonly externalDataImportServices: ExternalDataImportService,
    private readonly documentsImportService: DocumentsImportService,
  ) {}

  @Post('/companies/:id')
  async getCompanies(@Param() param, @Body() data): Promise<any> {
    return this.externalDataImportServices.importData(param.id, {
      email: data.email,
      userId: data.userId,
      defaultPassword: data.defaultPassword,
    });
  }

  @Get('/company/documents/:id')
  async getDocuments(@Param() param): Promise<any> {
    return this.documentsImportService.getDocuments(param.id);
  }
}
