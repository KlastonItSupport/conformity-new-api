import { Module } from '@nestjs/common';
import { DocumentsController } from './controllers/documents.controller';
import { DocumentsService } from './services/documents.service';
import { Document } from './entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UsersModule } from '../users/users.module';
import { Category } from '../categories/entities/category.entity';
import { Departament } from '../departaments/entities/departament.entity';
import { Company } from '../companies/entities/company.entity';
import { AuditModule } from '../audit/audit.module';
import { DocumentDetailsPermissionController } from './controllers/permission.controller';
import { DocumentDetailsPermissionService } from './services/permission.service';
import { EvaluatorModule } from '../evaluators/evaluator.module';

@Module({
  controllers: [DocumentsController, DocumentDetailsPermissionController],
  imports: [
    TypeOrmModule.forFeature([Category, Document, Departament, Company]),
    SharedModule,
    PermissionsModule,
    UsersModule,
    AuditModule,
    EvaluatorModule,
  ],
  providers: [DocumentsService, DocumentDetailsPermissionService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
