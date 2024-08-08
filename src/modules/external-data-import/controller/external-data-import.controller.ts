import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExternalDataImportService } from '../services/external-data-import.services';
import { DocumentsImportService } from '../services/documents-import.services';
import { TasksImportService } from '../services/tasks-import.services';

@Controller('import')
export class ExternalDataImportController {
  constructor(
    private readonly externalDataImportServices: ExternalDataImportService,
    private readonly documentsImportService: DocumentsImportService,
    private readonly tasksImportService: TasksImportService,
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
    return await this.documentsImportService.getDocuments(param.id);
  }

  @Get('/company/tasks/:companyId')
  async getTasks(@Param() param) {
    return await this.tasksImportService.getTasks(param.companyId);
  }
}
