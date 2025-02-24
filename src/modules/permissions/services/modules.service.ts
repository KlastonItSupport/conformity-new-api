import { Injectable } from '@nestjs/common';
import { Modules } from '../entities/modules.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ModulesServices {
  constructor(
    @InjectRepository(Modules)
    private readonly modulesRepository: Repository<Modules>,
  ) {}
  async createModule(name: string): Promise<Modules> {
    const module = this.modulesRepository.create({ name });
    return this.modulesRepository.save(module);
  }
}
