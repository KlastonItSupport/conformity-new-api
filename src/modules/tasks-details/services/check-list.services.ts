import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskChecklist } from '../entities/checklist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CheckListServices {
  constructor(
    @InjectRepository(TaskChecklist)
    private readonly checkListRepository: Repository<TaskChecklist>,
  ) {}

  async createCheckList(data: {
    name: string;
    subtaskId: number;
    isCompleted?: boolean;
  }) {
    const checkList = this.checkListRepository.create(data);
    return await this.checkListRepository.save(checkList);
  }

  async getCheckList(subtaskId: number) {
    const checkList = await this.checkListRepository.find({
      where: { subtaskId },
    });

    if (!checkList) {
      throw new Error('Checklist not found');
    }

    return checkList;
  }

  async handleIsCompleted(checklistId: number) {
    const checkList = await this.checkListRepository.findOne({
      where: { id: checklistId },
    });

    if (!checkList) {
      throw new Error('Checklist not found');
    }

    checkList.isCompleted = !checkList.isCompleted;
    return await this.checkListRepository.save(checkList);
  }
  async deleteCheckList(checklistId: number) {
    const checkList = await this.checkListRepository.findOne({
      where: { id: checklistId },
    });

    if (!checkList) {
      throw new Error('Checklist not found');
    }

    return await this.checkListRepository.remove(checkList);
  }
}
