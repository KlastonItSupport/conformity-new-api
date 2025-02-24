import { Repository } from 'typeorm';
import { Config } from '../entities/configs.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConfigsService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {}

  async getToken(token: string) {
    return await this.configRepository.findOne({ where: { token } });
  }
}
