import { Injectable } from '@nestjs/common';
import { CreateDeadlinePayload } from '../dtos/create-deadline-payload';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksDeadlinesHistory } from '../entities/deadlines.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class DeadlinesServices {
  constructor(
    @InjectRepository(TasksDeadlinesHistory)
    private readonly deadlinesRepository: Repository<TasksDeadlinesHistory>,

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createDeadline(data: CreateDeadlinePayload) {
    const task = await this.taskRepository.findOne({
      where: { id: data.taskId },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }
    const deadline = this.deadlinesRepository.create(data);

    task.datePrevision = data.newDate as unknown as string;
    await this.taskRepository.save(task);

    const newDeadline = await this.deadlinesRepository.save(deadline);

    const deadlineOnDb = await this.deadlinesRepository.findOne({
      where: { id: newDeadline.id },
      relations: ['user'],
    });

    deadlineOnDb['userName'] = deadlineOnDb.user.name;
    delete deadlineOnDb.user;

    return deadlineOnDb;
  }

  async getDeadlines(taskId: number) {
    const deadlines = await this.deadlinesRepository.find({
      where: { taskId },
      relations: ['user'],
    });

    if (deadlines.length > 0) {
      return deadlines.map((deadline) => {
        deadline['userName'] = deadline.user.name;
        delete deadline.user;
        return deadline;
      });
    }
    return deadlines;
  }
}
