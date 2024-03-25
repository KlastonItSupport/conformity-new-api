import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Database from './database';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    Database.build(),
    UsersModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
