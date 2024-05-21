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
import { S3Service } from '../shared/services/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      User,
      Groups,
      Permissions,
      GroupModulePermission,
    ]),
    UsersModule,
    CompaniesModule,
    PermissionsModule,
  ],
  exports: [ExternalDataImportService],
  controllers: [ExternalDataImportController],
  providers: [
    ExternalDataImportService,
    UsersServices,
    CompanyService,
    PermissionsServices,
    S3Service,
  ],
})
export class ExternalDataImportModule {}
