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
    const category = this.departamentRepository.create(data);
    const savedCategory = await this.departamentRepository.save(category);
    return savedCategory;
  }

  async findAll(companyId: string) {
    return this.departamentRepository.find({ where: { companyId } });
  }
}
