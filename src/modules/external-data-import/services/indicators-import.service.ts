import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  formatIndicator,
  formatIndicatorAnswer,
} from '../formatters/indicators.formatter';
import { IndicatorsService } from 'src/modules/indicators/services/indicators.service';
import { IndicatorAnswerService } from 'src/modules/indicators/services/indicator-answer.service';
import { IndicatorTasks } from 'src/modules/indicators/entities/indicator-tasks.entity';

@Injectable()
export class IndicatorsImportService {
  constructor(
    @InjectDataSource('externalConnection')
    private connection: DataSource,

    private readonly indicatorsServices: IndicatorsService,
    private readonly indicatorAnswersService: IndicatorAnswerService,
    // private readonly taskIndicatorsService: TaskIndicatorsService,
    @InjectRepository(IndicatorTasks)
    private readonly indicatorTaskRepository: Repository<IndicatorTasks>,
  ) {}

  async getIndicators(companyId: string) {
    const query = `
      SELECT 
        selects.nome AS nome_departamento, 
        b.nome AS nome_dado, 
        c.nome AS nome_frequencia, 
        indicadores.* 
      FROM indicadores
      LEFT JOIN selects ON selects.id = indicadores.departamento
      LEFT JOIN selects b ON b.id = indicadores.dado
      LEFT JOIN selects c ON c.id = indicadores.frequencia
      WHERE indicadores.empresa = ?
    `;

    const result = await this.connection.query(query, [companyId]);
    const formattedIndicators = result.map((indicator) => {
      return formatIndicator(indicator);
    });
    return formattedIndicators;
  }

  async createIndicators(companyId: string, indicators: any[]) {
    const indicatorsCreated = indicators.map(async (indicator) => {
      try {
        const indicatorCreated = await this.indicatorsServices.create(
          indicator,
          companyId,
        );

        const answers = await this.getIndicatorAnswers(indicator.id);
        return { indicator: indicatorCreated, answers };
      } catch (e) {
        console.log('ERRO - createIndicators:', e);
      }
    });

    return await Promise.all(indicatorsCreated);
  }

  async getIndicatorAnswers(indicatorId: string) {
    const query = `
      SELECT 
        indicadores.objetivo AS nome_indicador, 
        indicadores_respostas.* 
      FROM indicadores_respostas
      LEFT JOIN indicadores ON indicadores.id = indicadores_respostas.indicador
      WHERE indicadores_respostas.indicador = ?
    `;

    const answers = await this.connection.query(query, [indicatorId]);
    const formattedAnswers = answers.map((answer) => {
      const answerFormatted = formatIndicatorAnswer(answer);
      return answerFormatted;
    });

    const answersCreatedPromise = formattedAnswers.map(async (answer) => {
      const indicatorAnswer = await this.indicatorAnswersService.create(answer);
      const tasksAnswers = await this.getAnswersTasks(answer.id);
      return { indicatorAnswer, tasksAnswers };
    });

    return Promise.all(answersCreatedPromise);
  }

  async getAnswersTasks(indicatorId: string) {
    const query = `SELECT * FROM indicadores_respostas_tasks WHERE resposta_id = ?`;
    const answersTasks = await this.connection.query(query, [indicatorId]);

    const promiseAnswersTasks = answersTasks.map(async (answerTask) => {
      try {
        const answerTaskCreated = this.indicatorTaskRepository.create({
          id: answerTask.id,
          taskId: answerTask.task_id,
          indicatorId: answerTask.resposta_id,
        });
        const saved =
          await this.indicatorTaskRepository.save(answerTaskCreated);

        return saved;
      } catch (e) {
        console.log('ERRO - getAnswersTasks:', answerTask);
      }
    });
    const res = await Promise.all(promiseAnswersTasks);
    return res;
  }

  async importIndicators(companyId: string) {
    const indicators = await this.getIndicators(companyId);
    const indicatorsCreated = await this.createIndicators(
      companyId,
      indicators,
    );

    // Process indicators as needed
    return indicatorsCreated;
  }
}
