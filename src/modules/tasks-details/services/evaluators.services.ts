import { Injectable } from '@nestjs/common';
import { TaskEvaluator } from '../entities/evaluator.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEvaluatorDto } from '../dtos/create-evaluator-payload';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class EvaluatorService {
  constructor(
    @InjectRepository(TaskEvaluator)
    private readonly evaluatorRepository: Repository<TaskEvaluator>,
  ) {}

  async createEvaluator(data: CreateEvaluatorDto) {
    const evaluatorPromise = data.usersIds.map(async (userId) => {
      const evaluator = this.evaluatorRepository.create({
        userId,
        taskId: Number(data.taskId),
        analyzed: data.analyzed,
        data: data.data,
      });
      return await this.evaluatorRepository.save(evaluator);
    });
    const createdEvaluators = await Promise.all(evaluatorPromise);

    const saved = createdEvaluators.map(async (evaluator) => {
      const evaluatorTask = await this.evaluatorRepository.findOne({
        where: { id: evaluator.id },
        relations: ['user'],
      });

      return evaluatorTask;
    });
    return await Promise.all(saved);
  }

  async deleteEvaluator(id: number) {
    const evaluator = await this.evaluatorRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!evaluator) {
      throw new AppError('Evaluator not found', 404);
    }

    return await this.evaluatorRepository.remove(evaluator);
  }

  async getEvaluator(id: number) {
    const evaluator = await this.evaluatorRepository.find({
      where: { taskId: id },
      relations: ['user'],
    });

    if (!evaluator) {
      throw new AppError('Evaluator not found', 404);
    }

    return evaluator;
  }
}
