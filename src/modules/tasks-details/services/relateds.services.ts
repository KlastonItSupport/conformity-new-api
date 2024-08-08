import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRelatedTasksPayload } from '../dtos/create-related-tasks.payload';
import { AppError } from 'src/errors/app-error';
import { TaskSubtask } from '../entities/relateds.entity';

@Injectable()
export class RelatedsServices {
  constructor(
    @InjectRepository(TaskSubtask)
    private readonly subtasksRepository: Repository<TaskSubtask>,
  ) {}

  async createRelateds(data: CreateRelatedTasksPayload) {
    const subtask = this.subtasksRepository.create(data);
    return await this.subtasksRepository.save(subtask);
  }

  async deleteSubtask(id: number) {
    const subtask = await this.subtasksRepository.findOne({
      where: { id },
    });

    if (!subtask) {
      throw new Error('Related task not found');
    }

    return await this.subtasksRepository.remove(subtask);
  }

  async getRelateds(id: number) {
    const subtask = await this.subtasksRepository.find({
      where: { taskId: id },
      order: { order: 'ASC' },
    });

    if (!subtask) {
      throw new AppError('Related task not found', 404);
    }

    return subtask;
  }

  async completeSubtasks(id: number) {
    const subtask = await this.subtasksRepository.findOne({
      where: { id: id },
    });

    if (!subtask) {
      throw new AppError('Subtask not found', 404);
    }

    subtask.completed = true;
    return await this.subtasksRepository.save(subtask);
  }

  async uncompleteSubtasks(id: number) {
    const subtask = await this.subtasksRepository.findOne({
      where: { id: id },
    });

    if (!subtask) {
      throw new AppError('Subtask not found', 404);
    }

    subtask.completed = false;
    return await this.subtasksRepository.save(subtask);
  }

  async changeOrder(id: number, newOrder: number) {
    const subtask = await this.subtasksRepository.findOne({
      where: { id: id },
    });

    if (!subtask) {
      throw new AppError('Subtask not found', 404);
    }

    const relatedSubtasks = await this.subtasksRepository.find({
      where: { taskId: subtask.taskId },
      order: { order: 'ASC' },
    });

    const indexOfUpdatedSubtask = relatedSubtasks.findIndex(
      (task) => task.id === Number(id),
    );

    const [movedSubtask] = relatedSubtasks.splice(indexOfUpdatedSubtask, 1);

    const adjustedNewOrder = Math.min(
      Math.max(newOrder - 1, 0),
      relatedSubtasks.length,
    );

    relatedSubtasks.splice(adjustedNewOrder, 0, movedSubtask);

    for (let i = 0; i < relatedSubtasks.length; i++) {
      relatedSubtasks[i].order = i + 1;
    }

    await this.subtasksRepository.save(relatedSubtasks);

    return movedSubtask;
  }
}
