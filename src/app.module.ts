import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Database from './database';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ErrorLoggingMiddleware } from './middlewares/error-logs/error-logs';
import { ErrorLogsModule } from './middlewares/error-logs/error-logs.module';
import { SharedModule } from './modules/shared/shared.module';
import { ExternalDataImportModule } from './modules/external-data-import/external-data-import.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from './modules/documents/documents.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DepartamentModule } from './modules/departaments/departament.module';
import { FeedModule } from './modules/feed/feed.module';
import { DocumentRevisionsModule } from './modules/document-revisions/document-revision.module';
import { EvaluatorModule } from './modules/evaluators/evaluator.module';
import { DocumentRelatedsModule } from './modules/document-relateds/document-relateds.module';
import { DepartamentsPermissionsModule } from './modules/departaments-permissions/departaments-permissions.module';
import { ReminderModule } from './modules/reminders/reminder.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TasksDetailsModule } from './modules/tasks-details/tasks-details.module';
import { EquipmentsModule } from './modules/equipments/equipments.module';
import { IndicatorsModule } from './modules/indicators/indicators.module';
import { ServiceModule } from './modules/services/service.module';
import { ContractModule } from './modules/contracts/contracts.module';
import { CrmCompaniesModule } from './modules/crm-companies/crm-companies.module';
import { ProjectModule } from './modules/projects/projects.module';
import { LeadsModule } from './modules/leads/leads.module';
import { CnpjInfoModule } from './modules/cnpj-infos/cnpj-info.module';
import { SchoolsModule } from './modules/schools/schools.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Database.build(),
    // CONFORMITY ATUAL DBS
    TypeOrmModule.forRoot({
      name: 'externalConnection',
      type: 'mysql',
      host: process.env.EXTERNAL_DB_HOST,
      port: 3306,
      username: process.env.EXTERNAL_DB_USERNAME,
      password: process.env.EXTERNAL_DB_PASSWORD,
      database: process.env.EXTERNAL_DB_NAME,
    }),
    UsersModule,
    CompaniesModule,
    PermissionsModule,
    ErrorLogsModule,
    SharedModule,
    ExternalDataImportModule,
    DocumentsModule,
    CategoriesModule,
    DepartamentModule,
    FeedModule,
    DocumentRevisionsModule,
    EvaluatorModule,
    DocumentRelatedsModule,
    DepartamentsPermissionsModule,
    ReminderModule,
    MailerModule,
    TasksModule,
    TasksDetailsModule,
    EquipmentsModule,
    IndicatorsModule,
    ServiceModule,
    CrmCompaniesModule,
    ContractModule,
    ProjectModule,
    LeadsModule,
    CnpjInfoModule,
    SchoolsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ErrorLoggingMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorLoggingMiddleware).forRoutes('*');
  }
}
