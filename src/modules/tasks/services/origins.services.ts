import { Injectable } from '@nestjs/common';
import { TaskOrigin } from '../entities/task-origin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/entities/company.entity';

@Injectable()
export class OriginsServices {
  constructor(
    @InjectRepository(TaskOrigin)
    private readonly originsRepository: Repository<TaskOrigin>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async getOrigins(companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });
    return await this.originsRepository.find({
      where: { company },
    });
  }

  async createOrigin(name: string, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const origin = this.originsRepository.create({
      name,
      company,
    });

    return await this.originsRepository.save(origin);
  }
}
