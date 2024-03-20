import { Module } from '@nestjs/common';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controllers/company.controller';

@Module({
  controllers: [CompanyController],
  imports: [TypeOrmModule.forFeature([Company])],
})
export class CompaniesModule {}
