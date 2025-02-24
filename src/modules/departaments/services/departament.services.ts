import { Injectable } from '@nestjs/common';
import { Departament } from '../entities/departament.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDepartamentDto } from '../dtos/departament-category.dto';

@Injectable()
export class DepartamentService {
  constructor(
    @InjectRepository(Departament)
    private readonly departamentRepository: Repository<Departament>,
  ) {}

  async createCategory(data: CreateDepartamentDto) {
    const departament = this.departamentRepository.create(data);
    const savedDpartament = await this.departamentRepository.save(departament);
    return savedDpartament;
  }

  async findAll(companyId: string) {
    return await this.departamentRepository.find({ where: { companyId } });
  }
}
