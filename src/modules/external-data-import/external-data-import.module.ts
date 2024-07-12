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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      User,
      Groups,
      Permissions,
      GroupModulePermission,
      Departament,
    ]),
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
  ],
  exports: [ExternalDataImportService],
  controllers: [ExternalDataImportController],
  providers: [
    ExternalDataImportService,
    DocumentsImportService,
    UsersServices,
    CompanyService,
    PermissionsServices,
  ],
})
export class ExternalDataImportModule {}
