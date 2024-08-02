import { Injectable } from '@nestjs/common';
import { TaskCorrectiveAction } from '../entities/corrective-actiones.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCorrectiveActionsPayload } from '../dtos/create-corrective-actions.payload';

@Injectable()
export class CorrectiveActionsServices {
  constructor(
    @InjectRepository(TaskCorrectiveAction)
    private readonly correctiveActionsRepository: Repository<TaskCorrectiveAction>,
  ) {}

  async createCorrectiveActions(data: CreateCorrectiveActionsPayload) {
    const correctiveAction = this.correctiveActionsRepository.create(data);
    return await this.correctiveActionsRepository.save(correctiveAction);
  }

  async getCorrectiveActions(id: number) {
    const correctiveAction = await this.correctiveActionsRepository.find({
      where: { taskId: id },
    });

    if (!correctiveAction) {
      throw new Error('Corrective Action not found');
    }

    return correctiveAction;
  }
  async deleteCorrectiveActions(id: number) {
    const correctiveAction = await this.correctiveActionsRepository.findOne({
      where: { id },
    });

    if (!correctiveAction) {
      throw new Error('Corrective Action not found');
    }

    return await this.correctiveActionsRepository.remove(correctiveAction);
  }

  async editCorrectiveActions(
    id: number,
    data: Partial<CreateCorrectiveActionsPayload>,
  ) {
    const correctiveAction = await this.correctiveActionsRepository.findOne({
      where: { id },
    });

    if (!correctiveAction) {
      throw new Error('Corrective Action not found');
    }

    if (data.date) {
      correctiveAction.date = data.date;
    }
    if (data.result) {
      correctiveAction.result = data.result;
    }
    if (data.action) {
      correctiveAction.action = data.action;
    }
    if (data.responsable) {
      correctiveAction.responsable = data.responsable;
    }

    return this.correctiveActionsRepository.save(correctiveAction);
  }
}
