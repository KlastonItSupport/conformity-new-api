import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskType } from '../entities/task-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/entities/company.entity';

@Injectable()
export class TypesServices {
  constructor(
    @InjectRepository(TaskType)
    private readonly typesRepository: Repository<TaskType>,

    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async getTypes(companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    return await this.typesRepository.find({
      where: { company },
    });
  }

  async createType(name: string, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const type = this.typesRepository.create({
      name,
      company,
    });

    return await this.typesRepository.save(type);
  }
}
