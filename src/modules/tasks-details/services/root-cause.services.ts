import { Injectable } from '@nestjs/common';
import { TaskRootCause } from '../entities/root-cause.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class RootCauseServices {
  constructor(
    @InjectRepository(TaskRootCause)
    private readonly rootCauseRepository: Repository<TaskRootCause>,
  ) {}

  async createRootCause(data: Partial<TaskRootCause>) {
    const rootCause = this.rootCauseRepository.create(data);
    return await this.rootCauseRepository.save(rootCause);
  }

  async deleteRootCause(id: number) {
    const rootCause = await this.rootCauseRepository.findOne({
      where: { id },
    });

    if (!rootCause) {
      throw new AppError('Root Cause not found', 404);
    }

    return await this.rootCauseRepository.remove(rootCause);
  }

  async editRootCause(id: number, data: Partial<TaskRootCause>) {
    const rootCause = await this.rootCauseRepository.findOne({
      where: { id },
    });

    if (!rootCause) {
      throw new AppError('Root Cause not found', 404);
    }

    if (data.rootCause) {
      rootCause.rootCause = data.rootCause;
    }

    return this.rootCauseRepository.save(rootCause);
  }

  async getRootCause(id: number) {
    const rootCause = await this.rootCauseRepository.find({
      where: { taskId: id },
    });

    if (!rootCause) {
      throw new AppError('Root Cause not found', 404);
    }

    return rootCause;
  }
}
