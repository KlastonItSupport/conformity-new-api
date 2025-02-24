import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskClassifications } from '../entities/task-classifications.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class ClassificationsServices {
  constructor(
    @InjectRepository(TaskClassifications)
    private readonly classificationsRepository: Repository<TaskClassifications>,

    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async getClassifications(
    companyId: string,
    search?: { search?: string; page?: number; pageSize?: number },
  ) {
    if ((search && search.page) || search.pageSize || search.search) {
      const queryBuilder =
        this.classificationsRepository.createQueryBuilder('classifications');

      if (search.search) {
        const searchParam = `%${search.search || ''}%`;

        queryBuilder.andWhere((qb) => {
          qb.where('classifications.name LIKE :searchParam', { searchParam });
        });
      }

      queryBuilder.andWhere(
        'classifications.task_classifications_company_fk = :companyId',
        {
          companyId,
        },
      );

      if (search.page && search.pageSize) {
        queryBuilder
          .offset((search.page - 1) * search.pageSize)
          .limit(search.pageSize);
      }

      const pagination = {};
      const origins = await queryBuilder.getManyAndCount();
      const totalOrigins = origins[1];
      const lastPage = search.pageSize
        ? Math.ceil(totalOrigins / search.pageSize)
        : 1;

      const links = {
        first: 1,
        last: lastPage,
        next: search.page + 1 > lastPage ? lastPage : search.page + 1,
        totalPages: search.pageSize
          ? Math.ceil(totalOrigins / search.pageSize)
          : 1,
        currentPage: search.pageSize ? search.page : 1,
        previous: search.pageSize
          ? search.page > 1
            ? search.page - 1
            : 0
          : null,
        totalItems: totalOrigins,
      };

      pagination['items'] = origins[0];
      pagination['pages'] = links;

      return pagination;
    }
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    return await this.classificationsRepository.find({
      where: { company },
    });
  }

  async createClassification(name: string, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const classification = this.classificationsRepository.create({
      name,
      company,
    });

    return await this.classificationsRepository.save(classification);
  }

  async deleteClassification(id: number, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const classification = await this.classificationsRepository.findOne({
      where: { id, company },
    });

    if (!classification) {
      throw new AppError('Classification not found', 404);
    }

    return await this.classificationsRepository.remove(classification);
  }

  async updateClassification(id: number, name: string, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const classification = await this.classificationsRepository.findOne({
      where: { id, company },
    });

    if (!classification) {
      throw new AppError('Classification not found', 404);
    }

    classification.name = name;

    return await this.classificationsRepository.save(classification);
  }
}
