import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskType } from '../entities/task-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/entities/company.entity';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class TypesServices {
  constructor(
    @InjectRepository(TaskType)
    private readonly typesRepository: Repository<TaskType>,

    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async getTypes(
    companyId: string,
    search?: { search?: string; page?: number; pageSize?: number },
  ) {
    if ((search && search.page) || search.pageSize || search.search) {
      const queryBuilder = this.typesRepository.createQueryBuilder('types');

      if (search.search) {
        const searchParam = `%${search.search || ''}%`;

        queryBuilder.andWhere((qb) => {
          qb.where('types.name LIKE :searchParam', { searchParam });
        });
      }

      queryBuilder.andWhere('types.task_types_company_fk = :companyId', {
        companyId,
      });

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

    return await this.typesRepository.find({
      where: { company },
    });
  }

  async createType(name: string, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const type = this.typesRepository.create({
      name,
      company,
    });

    return await this.typesRepository.save(type);
  }

  async deleteType(id: number, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const type = await this.typesRepository.findOne({
      where: { id, company },
    });

    if (!type) {
      throw new AppError('Type not found', 404);
    }

    return await this.typesRepository.remove(type);
  }

  async updateType(id: number, name: string, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const type = await this.typesRepository.findOne({
      where: { id, company },
    });

    if (!type) {
      throw new AppError('Type not found', 404);
    }

    type.name = name;

    return await this.typesRepository.save(type);
  }
}
