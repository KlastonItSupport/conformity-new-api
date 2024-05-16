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

@Module({
  imports: [
    ConfigModule.forRoot(),
    Database.build(),
    UsersModule,
    CompaniesModule,
    PermissionsModule,
    ErrorLogsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, ErrorLoggingMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorLoggingMiddleware).forRoutes('*');
  }
}
