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
import { TrainingModule } from './modules/trainings/training.module';
import { UserTrainingsModule } from './modules/user-trainings/user-trainings.module';
import { MatrizModule } from './modules/matriz/matriz.module';
import { RolesModule } from './modules/roles/roles.module';
import { WarningsModule } from './modules/warnings/warnings.module';
import { SupportModule } from './modules/support/support.module';
import { AuditModule } from './modules/audit/audit.module';
import { ResponseInterceptor } from './guards/interceptors/response.interceptor';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Database.build(),
    // CONFORMITY ATUAL DBS
    TypeOrmModule.forRoot({
      name: 'externalConnection',
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
    TrainingModule,
    UserTrainingsModule,
    MatrizModule,
    RolesModule,
    WarningsModule,
    SupportModule,
    AuditModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService, ErrorLoggingMiddleware, ResponseInterceptor],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorLoggingMiddleware).forRoutes('*');
  }
}
