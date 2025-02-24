import { Module } from '@nestjs/common';
import { ExternalDataImportService } from './services/external-data-import.services';
import { ExternalDataImportController } from './controller/external-data-import.controller';
import { UsersServices } from '../users/services/users.services';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { CompanyService } from '../companies/services/company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/users.entity';
import { Groups } from '../permissions/entities/groups.entity';
import { GroupModulePermission } from '../permissions/entities/group_module_permissions.entity';
import { Permissions } from '../permissions/entities/permissions.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionsServices } from '../permissions/services/permissions.service';
import { SharedModule } from '../shared/shared.module';
import { DocumentsModule } from '../documents/documents.module';
import { DepartamentModule } from '../departaments/departament.module';
import { CategoriesModule } from '../categories/categories.module';
import { DocumentRevisionsModule } from '../document-revisions/document-revision.module';
import { FeedModule } from '../feed/feed.module';
import { DepartamentsPermissionsModule } from '../departaments-permissions/departaments-permissions.module';
import { EvaluatorModule } from '../evaluators/evaluator.module';
import { Departament } from '../departaments/entities/departament.entity';
import { DocumentRelatedsModule } from '../document-relateds/document-relateds.module';
import { ReminderModule } from '../reminders/reminder.module';
import { DocumentsImportService } from './services/documents-import.services';
import { TasksImportService } from './services/tasks-import.services';
import { TasksModule } from '../tasks/tasks.module';
import { TaskOrigin } from '../tasks/entities/task-origin.entity';
import { TaskType } from '../tasks/entities/task-type.entity';
import { TaskClassifications } from '../tasks/entities/task-classifications.entity';
import { Task } from '../tasks/entities/task.entity';
import { TasksDetailsModule } from '../tasks-details/tasks-details.module';
import { EquipmentImportService } from './services/equipment-import.services';
import { EquipmentsModule } from '../equipments/equipments.module';
import { IndicatorsImportService } from './services/indicators-import.service';
import { IndicatorsModule } from '../indicators/indicators.module';
import { IndicatorTasks } from '../indicators/entities/indicator-tasks.entity';
import { CrmImportServices } from './services/crm-import.services';
import { ContractModule } from '../contracts/contracts.module';
import { ServiceModule } from '../services/service.module';
import { CrmCompaniesModule } from '../crm-companies/crm-companies.module';
import { ProjectModule } from '../projects/projects.module';
import { LeadsModule } from '../leads/leads.module';
import { SchoolsModule } from '../schools/schools.module';
import { TrainingsImportService } from './services/trainings-import.service';
import { TrainingModule } from '../trainings/training.module';
import { UserTrainingsModule } from '../user-trainings/user-trainings.module';
import { RolesModule } from '../roles/roles.module';
import { WarningsModule } from '../warnings/warnings.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      User,
      Groups,
      Permissions,
      GroupModulePermission,
      Departament,
      TaskOrigin,
      TaskType,
      TaskClassifications,
      Task,
      IndicatorTasks,
    ]),
    MailerModule,
    UsersModule,
    CompaniesModule,
    PermissionsModule,
    SharedModule,
    DocumentsModule,
    DepartamentModule,
    CategoriesModule,
    DocumentRevisionsModule,
    FeedModule,
    DepartamentsPermissionsModule,
    EvaluatorModule,
    DocumentRelatedsModule,
    ReminderModule,
    TasksModule,
    TasksDetailsModule,
    EquipmentsModule,
    IndicatorsModule,
    ContractModule,
    ServiceModule,
    CrmCompaniesModule,
    ProjectModule,
    LeadsModule,
    SchoolsModule,
    TrainingModule,
    UserTrainingsModule,
    RolesModule,
    WarningsModule,
  ],
  exports: [ExternalDataImportService],
  controllers: [ExternalDataImportController],
  providers: [
    ExternalDataImportService,
    DocumentsImportService,
    UsersServices,
    CompanyService,
    PermissionsServices,
    TasksImportService,
    EquipmentImportService,
    IndicatorsImportService,
    CrmImportServices,
    TrainingsImportService,
  ],
})
export class ExternalDataImportModule {}
