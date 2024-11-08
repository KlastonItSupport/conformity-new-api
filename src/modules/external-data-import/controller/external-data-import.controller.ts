import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExternalDataImportService } from '../services/external-data-import.services';
import { DocumentsImportService } from '../services/documents-import.services';
import { TasksImportService } from '../services/tasks-import.services';
import { EquipmentImportService } from '../services/equipment-import.services';
import { IndicatorsImportService } from '../services/indicators-import.service';
import { CrmImportServices } from '../services/crm-import.services';
import { TrainingsImportService } from '../services/trainings-import.service';

@Controller('import')
export class ExternalDataImportController {
  constructor(
    private readonly externalDataImportServices: ExternalDataImportService,
    private readonly documentsImportService: DocumentsImportService,
    private readonly tasksImportService: TasksImportService,
    private readonly equipmentImportService: EquipmentImportService,
    private readonly indicatorsImportService: IndicatorsImportService,
    private readonly crmImportServices: CrmImportServices,
    private readonly trainingImportService: TrainingsImportService,
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

  @Get('/company/equipments/:companyId')
  async getEquipments(@Param() param) {
    return await this.equipmentImportService.getAllEquipments(param.companyId);
  }

  @Get('/company/indicators/:companyId')
  async getIndicators(@Param() param) {
    return await this.indicatorsImportService.importIndicators(param.companyId);
  }

  @Get('/company/crm/:companyId')
  async getCrm(@Param('companyId') companyId) {
    return await this.crmImportServices.getCrmModule(companyId);
  }

  @Get('/company/trainings/:companyId')
  async getTrainings(@Param('companyId') companyId) {
    return await this.trainingImportService.getTrainingsModule(companyId);
  }
}
