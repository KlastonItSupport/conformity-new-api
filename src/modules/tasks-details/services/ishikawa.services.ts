import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskIshikawa } from '../entities/ishikawa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreativeIshikawaPayload } from '../dtos/creative-ishikawa.paylod';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class IshikawaServices {
  constructor(
    @InjectRepository(TaskIshikawa)
    private readonly ishikawaRepository: Repository<TaskIshikawa>,
  ) {}

  async createIshikawa(data: CreativeIshikawaPayload) {
    const ishikawa = this.ishikawaRepository.create(data);
    const savedIshikawa = await this.ishikawaRepository.save(ishikawa);

    const savedIshikawaOnDb = await this.ishikawaRepository.findOne({
      where: { id: savedIshikawa.id },
      relations: ['user'],
    });

    savedIshikawaOnDb.responsable = savedIshikawaOnDb.user.name;
    delete savedIshikawaOnDb.user;
    return savedIshikawaOnDb;
  }

  async getIshikawa(id: number) {
    const ish = await this.ishikawaRepository.find({
      where: { taskId: id },
      relations: ['user'],
    });

    return ish.map((ishikawa) => {
      ishikawa.responsable = ishikawa.user.name;
      delete ishikawa.user;
      return ishikawa;
    });
  }

  async deleteIshikawa(id: number) {
    const ishikawa = await this.ishikawaRepository.findOne({
      where: { id },
    });

    if (!ishikawa) {
      throw new AppError('Not found', 404);
    }

    return await this.ishikawaRepository.remove(ishikawa);
  }

  async updateIshikawa(
    id: number,
    data: Partial<TaskIshikawa>,
  ): Promise<TaskIshikawa> {
    const ishikawa = await this.ishikawaRepository.findOne({ where: { id } });

    if (!ishikawa) {
      throw new AppError('Not found', 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, taskId, id: dataId, ...updatableData } = data;

    Object.assign(ishikawa, updatableData);

    await this.ishikawaRepository.save(ishikawa);

    const savedIshikawaOnDb = await this.ishikawaRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    savedIshikawaOnDb.responsable = savedIshikawaOnDb.user.name;
    delete savedIshikawaOnDb.user;

    return savedIshikawaOnDb;
  }
}
