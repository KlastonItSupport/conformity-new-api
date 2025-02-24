import { Module } from '@nestjs/common';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { ConfigsService } from './services/configs.services';
import { Config } from './entities/configs.entity';
import { User } from '../users/entities/users.entity';

@Module({
  controllers: [CompanyController],
  imports: [TypeOrmModule.forFeature([Config, Company, User])],
  providers: [CompanyService, ConfigsService],
  exports: [ConfigsService],
})
export class CompaniesModule {}
