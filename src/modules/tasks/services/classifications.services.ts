import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskClassifications } from '../entities/task-classifications.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClassificationsServices {
  constructor(
    @InjectRepository(TaskClassifications)
    private readonly classificationsRepository: Repository<TaskClassifications>,

    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async getClassifications(companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    return await this.classificationsRepository.find({
      where: { company },
    });
  }

  async createClassification(name: string, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const classification = this.classificationsRepository.create({
      name,
      company,
    });

    return await this.classificationsRepository.save(classification);
  }
}
