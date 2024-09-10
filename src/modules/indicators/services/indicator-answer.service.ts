import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { IndicatorAnswer } from '../entities/indicator-answer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIndicatorAnswerDto } from '../dtos/answer-payload';
import { AppError } from 'src/errors/app-error';
import { PagesParams } from '../dtos/pages-params.dto';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { Indicator } from '../entities/indicators.entity';

@Injectable()
export class IndicatorAnswerService {
  constructor(
    @InjectRepository(IndicatorAnswer)
    private readonly indicatorAnswerRepository: Repository<IndicatorAnswer>,
  ) {}

  async get(
    indicatorId: number,
    pagesParam: PagesParams,
    searchSelects: {
      initialDate?: string;
      finalDate?: string;
    },
  ) {
    const hasSearchSelects =
      searchSelects &&
      Object.values(searchSelects).some((value) => value !== undefined);

    const queryBuilder = this.indicatorAnswerRepository
      .createQueryBuilder('indicator_answers')
      .leftJoinAndSelect('indicator_answers.indicator', 'indicators')
      .leftJoinAndSelect('indicator_answers.indicatorTasks', 'indicator_tasks')
      .orderBy('indicator_answers.date', 'ASC')
      .where('indicator_answers.indicator_fk = :indicatorId', {
        indicatorId,
      });

    if (pagesParam.page && pagesParam.pageSize) {
      queryBuilder
        .offset((pagesParam.page - 1) * pagesParam.pageSize)
        .limit(pagesParam.pageSize);
    }
    if (hasSearchSelects) {
      if (searchSelects.initialDate) {
        queryBuilder.andWhere('indicator_answers.date >= :initialDate', {
          initialDate: searchSelects.initialDate,
        });
      }
      if (searchSelects.finalDate) {
        queryBuilder.andWhere('indicator_answers.date <= :finalDate', {
          finalDate: searchSelects.finalDate,
        });
      }
    }

    if (!hasSearchSelects) {
      const searchParam = `%${pagesParam.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('indicator_answers.answer LIKE :search')
            .orWhere('indicator_answers.goal LIKE :search')
            .orWhere('indicator_answers.reason LIKE :search');
        }),
        { search: searchParam },
      );
    }

    const answers = await queryBuilder.getManyAndCount();
    const totalItems = answers[1];
    const lastPage = pagesParam.pageSize
      ? Math.ceil(totalItems / pagesParam.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: answers[0].map((answer) => {
        const answerFormatted = {
          ...answer,
          indicator: answer.indicator.goal,
          tasks: answer.indicatorTasks.map((task) => task.taskId),
        };

        delete answerFormatted['indicatorTasks'];

        return answerFormatted;
      }),
      lastPage,
      page: pagesParam?.page,
      pageSize: pagesParam?.pageSize,
      totalData: totalItems,
    });

    return paginationLinks;
  }

  async create(data: CreateIndicatorAnswerDto) {
    const indicatorAnswer = this.indicatorAnswerRepository.create(data);

    const indicatorAnswerDb =
      await this.indicatorAnswerRepository.save(indicatorAnswer);

    const indicatorAnswerDbWithRelations =
      await this.indicatorAnswerRepository.findOne({
        where: { id: indicatorAnswerDb.id },
        relations: ['indicator'],
      });

    indicatorAnswer['indicator'] = indicatorAnswerDbWithRelations.indicator
      .goal as unknown as Indicator;

    return indicatorAnswer;
  }

  async update(data: Partial<CreateIndicatorAnswerDto>, id) {
    const indicatorAnswer = await this.indicatorAnswerRepository.findOne({
      where: { id },
    });

    if (!indicatorAnswer) {
      throw new AppError('Indicator answer not found', 404);
    }

    delete data['id'];
    delete data['companyId'];
    delete data['indicatorId'];
    Object.assign(indicatorAnswer, data);
    const updatedIndicatorAnswer =
      await this.indicatorAnswerRepository.save(indicatorAnswer);

    const indicatorAnswerDbWithRelations =
      await this.indicatorAnswerRepository.findOne({
        where: { id: updatedIndicatorAnswer.id },
        relations: ['indicator'],
      });

    indicatorAnswer['indicator'] = indicatorAnswerDbWithRelations.indicator
      .goal as unknown as Indicator;
    return indicatorAnswer;
  }

  async delete(id: number) {
    const indicatorAnswer = await this.indicatorAnswerRepository.findOne({
      where: { id },
    });

    if (!indicatorAnswer) {
      throw new AppError('Indicator answer not found', 404);
    }
    return await this.indicatorAnswerRepository.remove(indicatorAnswer);
  }
}
