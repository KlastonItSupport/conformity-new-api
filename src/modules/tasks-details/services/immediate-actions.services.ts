import { Injectable } from '@nestjs/common';
import { ImmediateAction } from '../entities/immediate-actions.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateImmediateActionPayload } from '../dtos/create-immediate-action.payload';

@Injectable()
export class ImmediateActionsServices {
  constructor(
    @InjectRepository(ImmediateAction)
    private readonly immediateActionsRepository: Repository<ImmediateAction>,
  ) {}

  async createImmediateActions(data: CreateImmediateActionPayload) {
    const immediateAction = this.immediateActionsRepository.create(data);

    const savedImmediateAction =
      await this.immediateActionsRepository.save(immediateAction);

    const savedImmediateActionOnDb =
      await this.immediateActionsRepository.findOne({
        where: { id: savedImmediateAction.id },
      });

    delete savedImmediateActionOnDb.user;

    return savedImmediateActionOnDb;
  }

  async getImmediateActions(id: number) {
    const immediateAction = await this.immediateActionsRepository.find({
      where: { taskId: id },
    });

    return immediateAction;
  }
  async deleteImmediateActions(id: number) {
    const immediateAction = await this.immediateActionsRepository.findOne({
      where: { id },
    });

    if (!immediateAction) {
      throw new Error('Immediate Action not found');
    }

    return await this.immediateActionsRepository.remove(immediateAction);
  }

  async editImmediateActions(
    id: number,
    data: Partial<CreateImmediateActionPayload>,
  ) {
    const immediateAction = await this.immediateActionsRepository.findOne({
      where: { id },
    });

    if (!immediateAction) {
      throw new Error('Immediate Action not found');
    }

    if (data.date) {
      immediateAction.date = data.date;
    }
    if (data.action) {
      immediateAction.action = data.action;
    }

    if (data.responsable) {
      immediateAction.responsable = data.responsable;
    }

    return this.immediateActionsRepository.save(immediateAction);
  }
}
