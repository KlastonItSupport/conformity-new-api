import { Module } from '@nestjs/common';
import { EvaluatorsController } from './controllers/evaluators.controller';
import { EvaluatorService } from './services/evaluators.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEvaluator } from './entities/evaluator.entity';
import { DeadlinesController } from './controllers/deadlines.controller';
import { DeadlinesServices } from './services/deadlines.services';
import { TasksDeadlinesHistory } from './entities/deadlines.entity';
import { Task } from '../tasks/entities/task.entity';
import { RootCauseAnalysisServices } from './services/root-cause-analysis.services';
import { RootCauseAnalysisController } from './controllers/root-cause-analysis.controller';
import { TaskRootCauseAnalysis } from './entities/root-cause-analysis.entity';
import { RootCauseController } from './controllers/root-cause.controller';
import { TaskRootCause } from './entities/root-cause.entity';
import { RootCauseServices } from './services/root-cause.services';
import { CorrectiveActionsServices } from './services/corrective-actions.services';
import { CorrectiveActionsController } from './controllers/corrective-actions.controller';
import { TaskCorrectiveAction } from './entities/corrective-actiones.entity';
import { ImmediateAction } from './entities/immediate-actions.entity';
import { ImmediateActionsController } from './controllers/immediate-actions.controller';
import { ImmediateActionsServices } from './services/immediate-actions.services';
import { IshikawaController } from './controllers/ishikawa.controller';
import { IshikawaServices } from './services/ishikawa.services';
import { TaskIshikawa } from './entities/ishikawa.entity';
import { RelatedsController } from './controllers/relateds.controller';
import { RelatedsServices } from './services/relateds.services';
import { CheckListController } from './controllers/check-list.controller';
import { CheckListServices } from './services/check-list.services';
import { TaskChecklist } from './entities/checklist.entity';
import { TaskSubtask } from './entities/relateds.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEvaluator,
      TasksDeadlinesHistory,
      TaskRootCauseAnalysis,
      TaskRootCause,
      TaskCorrectiveAction,
      ImmediateAction,
      Task,
      TaskIshikawa,
      TaskSubtask,
      TaskChecklist,
    ]),
  ],
  controllers: [
    EvaluatorsController,
    DeadlinesController,
    RootCauseAnalysisController,
    RootCauseController,
    CorrectiveActionsController,
    ImmediateActionsController,
    IshikawaController,
    RelatedsController,
    CheckListController,
  ],
  providers: [
    EvaluatorService,
    DeadlinesServices,
    RootCauseAnalysisServices,
    RootCauseServices,
    CorrectiveActionsServices,
    ImmediateActionsServices,
    IshikawaServices,
    RelatedsServices,
    CheckListServices,
  ],
  exports: [
    EvaluatorService,
    DeadlinesServices,
    RootCauseAnalysisServices,
    IshikawaServices,
    RootCauseServices,
    ImmediateActionsServices,
    CorrectiveActionsServices,
  ],
})
export class TasksDetailsModule {}
