import { Injectable } from '@nestjs/common';
import { CreateIndicatorDto } from '../dtos/create-indicator-payload';
import { Brackets, Repository } from 'typeorm';
import { Indicator } from '../entities/indicators.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError } from 'src/errors/app-error';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { PagesParams } from '../dtos/pages-params.dto';
import { IndicatorAnswer } from '../entities/indicator-answer.entity';

@Injectable()
export class IndicatorsService {
  constructor(
    @InjectRepository(Indicator)
    private readonly indicatorsRepository: Repository<Indicator>,

    @InjectRepository(IndicatorAnswer)
    private readonly indicatorAnswerRepository: Repository<IndicatorAnswer>,
  ) {}

  async getAll(
    pagesParam: PagesParams,
    companyId: string,
    departmentId?: string,
  ) {
    const queryBuilder = this.indicatorsRepository
      .createQueryBuilder('indicators')
      .leftJoinAndSelect('indicators.department', 'department')
      .where('indicators.companyId = :companyId', { companyId })
      .take(pagesParam?.pageSize)
      .skip((pagesParam?.page - 1) * pagesParam?.pageSize);

    if (departmentId) {
      queryBuilder.andWhere(
        'indicators.indicators_department_fk = :departmentId',
        {
          departmentId,
        },
      );
    }
    if (pagesParam?.search) {
      const searchParam = `%${pagesParam.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('indicators.collectDay LIKE :searchParam', { searchParam })
            .orWhere('indicators.responsable LIKE :searchParam', {
              searchParam,
            })
            .orWhere('indicators.goal LIKE :searchParam', { searchParam })
            .orWhere('indicators.frequency LIKE :searchParam', { searchParam })
            .orWhere('indicators.dataType LIKE :searchParam', { searchParam })
            .orWhere('indicators.meta LIKE :searchParam', { searchParam })
            .orWhere('indicators.howToMeasure LIKE :searchParam', {
              searchParam,
            })
            .orWhere('indicators.deadline LIKE :searchParam', { searchParam })
            .orWhere('indicators.direction LIKE :searchParam', { searchParam })
            .orWhere('department.name LIKE :searchParam', {
              searchParam,
            });
        }),
      );
    }

    const [indicators, totalItems] = await queryBuilder.getManyAndCount();

    const lastPage = pagesParam?.pageSize
      ? Math.ceil(totalItems / pagesParam.pageSize)
      : 1;
    const paginationLinks = buildPaginationLinks({
      data: indicators,
      lastPage,
      page: pagesParam?.page,
      pageSize: pagesParam?.pageSize,
      totalData: totalItems,
    });

    const indicatorsFormatted = paginationLinks.items.map(async (item) => {
      const status = await this.getCorrectStatus(item);
      return {
        ...item,
        department: item.department.name,
        departamentId: item.department.id,
        status,
      };
    });
    paginationLinks.items = await Promise.all(indicatorsFormatted);

    return paginationLinks;
  }

  async create(data: CreateIndicatorDto, companyId: string) {
    const indicator = this.indicatorsRepository.create({ ...data, companyId });
    const savedIndicator = await this.indicatorsRepository.save(indicator);
    const indicatorOnDb = await this.indicatorsRepository.findOne({
      where: { id: savedIndicator.id },
      relations: ['department'],
    });
    return {
      ...savedIndicator,
      department: indicatorOnDb.department.name,
      departamentId: indicatorOnDb.department.id,
      status: 'Pendente',
    };
  }

  async delete(id: number) {
    const indicator = await this.indicatorsRepository.findOne({
      where: { id },
    });

    if (!indicator) {
      throw new AppError('Indicator not found', 404);
    }
    return await this.indicatorsRepository.remove(indicator);
  }

  async update(id: number, data: Partial<CreateIndicatorDto>) {
    const indicator = await this.indicatorsRepository.findOne({
      where: { id },
    });

    if (!indicator) {
      throw new AppError('Indicator not found', 404);
    }

    delete data['id'];
    Object.assign(indicator, data);
    return await this.indicatorsRepository.save(indicator);
  }

  async getCorrectStatus(indicator: Indicator) {
    const indicatorAnswer = await this.indicatorAnswerRepository.findOne({
      where: { indicatorId: indicator.id },
      order: { date: 'DESC' },
    });
    if (!indicatorAnswer) {
      return 'Pendente';
    }

    const today = new Date().toISOString().split('T')[0];

    const oneWeekAHead = new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .split('T')[0];

    const oneMonthAHead = new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    )
      .toISOString()
      .split('T')[0];
    const twoMonthsAHead = new Date(
      new Date().setMonth(new Date().getMonth() + 2),
    )
      .toISOString()
      .split('T')[0];
    const threeMonthsAHead = new Date(
      new Date().setMonth(new Date().getMonth() + 3),
    )
      .toISOString()
      .split('T')[0];

    const sixMonthsAHead = new Date(
      new Date().setMonth(new Date().getMonth() + 6),
    )
      .toISOString()
      .split('T')[0];

    const oneYearAHead = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1),
    )
      .toISOString()
      .split('T')[0];

    const indicatorDateFormatted = new Date(indicatorAnswer.date)
      .toISOString()
      .split('T')[0];

    if (indicator.frequency === 'DIÁRIO') {
      if (indicatorDateFormatted < today) {
        return 'Pendente';
      }
      return 'Atualizado';
    }

    if (indicator.frequency === 'SEMANAL') {
      if (indicatorDateFormatted < oneWeekAHead) {
        return 'Pendente';
      }
      return 'Atualizado';
    }

    if (indicator.frequency === 'MENSAL') {
      if (indicatorDateFormatted < oneMonthAHead) {
        return 'Pendente';
      }
      return 'Atualizado';
    }

    if (indicator.frequency === 'BIMENSAL') {
      if (indicatorDateFormatted < twoMonthsAHead) {
        return 'Pendente';
      }
      return 'Atualizado';
    }

    if (indicator.frequency === 'TRIMESTRAL') {
      if (indicatorDateFormatted < threeMonthsAHead) {
        return 'Pendente';
      }
      return 'Atualizado';
    }

    if (indicator.frequency === 'SEMESTRAL') {
      if (indicatorDateFormatted < sixMonthsAHead) {
        return 'Pendente';
      }
      return 'Atualizado';
    }

    if (indicator.frequency === 'ANUAL') {
      if (indicatorDateFormatted < oneYearAHead) {
        return 'Pendente';
      }
      return 'Atualizado';
    }
  }
}
