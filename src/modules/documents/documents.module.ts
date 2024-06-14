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

@Module({
  controllers: [DocumentsController],
  imports: [
    TypeOrmModule.forFeature([Category, Document, Departament, Company]),
    SharedModule,

    PermissionsModule,
    UsersModule,
  ],
  providers: [DocumentsService],
  exports: [],
})
export class DocumentsModule {}
