import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRootCauseAnalysis } from '../entities/root-cause-analysis.entity';
import { CreateRootCauseAnalysisPayload } from '../dtos/create-root-cause-analysis-payload';
import { Repository } from 'typeorm';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class RootCauseAnalysisServices {
  constructor(
    @InjectRepository(TaskRootCauseAnalysis)
    private readonly rootCauseAnalysisRepository: Repository<TaskRootCauseAnalysis>,
  ) {}

  async createRootCauseAnalysis(data: CreateRootCauseAnalysisPayload) {
    const rootCauseAnalysis = this.rootCauseAnalysisRepository.create(data);
    const savedRootCauseAnalysis =
      await this.rootCauseAnalysisRepository.save(rootCauseAnalysis);

    const savedRootCauseAnalysisOnDb =
      await this.rootCauseAnalysisRepository.findOne({
        where: { id: savedRootCauseAnalysis.id },
        relations: ['user'],
      });

    savedRootCauseAnalysisOnDb.responsable =
      savedRootCauseAnalysisOnDb.user.name;
    delete savedRootCauseAnalysisOnDb.user;

    return savedRootCauseAnalysisOnDb;
  }

  async deleteRootCauseAnalysis(id: number) {
    const rootCauseAnalysis = await this.rootCauseAnalysisRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!rootCauseAnalysis) {
      throw new AppError('Root Cause Analysis not found', 404);
    }

    rootCauseAnalysis.responsable = rootCauseAnalysis.user.name;
    delete rootCauseAnalysis.user;

    return this.rootCauseAnalysisRepository.remove(rootCauseAnalysis);
  }

  async editRootCauseAnalysis(
    id: number,
    data: Partial<CreateRootCauseAnalysisPayload>,
  ) {
    const rootCauseAnalysis = await this.rootCauseAnalysisRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!rootCauseAnalysis) {
      throw new AppError('Root Cause Analysis not found', 404);
    }

    if (data.why) {
      rootCauseAnalysis.why = data.why;
    }
    if (data.answer) {
      rootCauseAnalysis.answer = data.answer;
    }
    if (data.date) {
      rootCauseAnalysis.date = data.date;
    }

    rootCauseAnalysis.responsable = rootCauseAnalysis.user.name;
    delete rootCauseAnalysis.user;
    return this.rootCauseAnalysisRepository.save(rootCauseAnalysis);
  }

  async getRootCauseAnalysis(id: number) {
    const rootCauseAnalysis = await this.rootCauseAnalysisRepository.find({
      where: { taskId: id },
      relations: ['user'],
    });

    if (!rootCauseAnalysis) {
      throw new AppError('Root Cause Analysis not found', 404);
    }
    const formattedRootCauseAnalysis = rootCauseAnalysis.map(
      (rootCauseAnalysis) => {
        rootCauseAnalysis.responsable = rootCauseAnalysis.user.name;
        delete rootCauseAnalysis.user;
        return rootCauseAnalysis;
      },
    );

    return formattedRootCauseAnalysis;
  }
}
