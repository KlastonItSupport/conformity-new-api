import { Injectable } from '@nestjs/common';
import { Evaluators } from '../entities/evaluators.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluatorCreatePayload } from '../dtos/create-evaluator-payload';
import { User } from 'src/modules/users/entities/users.entity';

@Injectable()
export class EvaluatorService {
  constructor(
    @InjectRepository(Evaluators)
    private readonly evaluatorRepository: Repository<Evaluators>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createEvaluator(data: EvaluatorCreatePayload) {
    const evaluator = this.evaluatorRepository.create(data);
    const evaluatorSaved = await this.evaluatorRepository.save(evaluator);

    const user = await this.userRepository.findOne({
      where: { id: evaluator.userId },
    });

    return { ...evaluatorSaved, userName: user.name };
  }

  async getEvaluator(documentId: string) {
    const evaluators = await this.evaluatorRepository.find({
      where: { documentId },
    });

    await Promise.all(
      evaluators.map(async (evaluator) => {
        const user = await this.userRepository.findOne({
          where: { id: evaluator.userId },
        });
        evaluator.userName = user?.name;
      }),
    );
    return evaluators;
  }

  async deleteEvaluator(id: number) {
    const evaluator = await this.evaluatorRepository.findOne({
      where: { id },
    });

    return await this.evaluatorRepository.remove(evaluator);
  }
}
