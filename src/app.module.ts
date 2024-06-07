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
  ],
  controllers: [AppController],
  providers: [AppService, ErrorLoggingMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorLoggingMiddleware).forRoutes('*');
  }
}
