import { Module } from '@nestjs/common';
import { IndicatorsService } from './services/indicators.service';
import { IndicatorsController } from './controllers/indicators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indicator } from './entities/indicators.entity';
import { IndicatorAnswer } from './entities/indicator-answer.entity';
import { IndicatorAnswerController } from './controllers/indicator-answer.controller';
import { IndicatorAnswerService } from './services/indicator-answer.service';
import { IndicatorTasks } from './entities/indicator-tasks.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Indicator, IndicatorAnswer, IndicatorTasks]),
  ],
  controllers: [IndicatorsController, IndicatorAnswerController],
  providers: [IndicatorsService, IndicatorAnswerService],
  exports: [IndicatorsService, IndicatorAnswerService],
})
export class IndicatorsModule {}
