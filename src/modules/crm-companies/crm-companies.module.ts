import { Module } from '@nestjs/common';
import { CrmController } from './controllers/crm-companies.controller';
import { CrmServices } from './services/crm-companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmCompany } from './entities/crm-company.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CrmCompany]), UsersModule],
  controllers: [CrmController],
  providers: [CrmServices],
  exports: [CrmServices],
})
export class CrmCompaniesModule {}
