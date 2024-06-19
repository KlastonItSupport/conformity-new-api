import { Module } from '@nestjs/common';
import { EvaluatorController } from './controllers/evaluator.controller';
import { EvaluatorService } from './services/evaluator.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluators } from './entities/evaluators.entity';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluators, User])],
  controllers: [EvaluatorController],
  providers: [EvaluatorService],
})
export class EvaluatorModule {}
