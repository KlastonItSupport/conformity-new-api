import { Module } from '@nestjs/common';
import { EvaluatorController } from './controllers/evaluator.controller';
import { EvaluatorService } from './services/evaluator.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluators } from './entities/evaluators.entity';
import { User } from '../users/entities/users.entity';
import { Document } from '../documents/entities/document.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluators, User, Document]),
    UsersModule,
  ],
  controllers: [EvaluatorController],
  providers: [EvaluatorService],
  exports: [EvaluatorService],
})
export class EvaluatorModule {}
