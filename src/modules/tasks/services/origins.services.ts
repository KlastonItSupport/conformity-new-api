import { Injectable } from '@nestjs/common';
import { TaskOrigin } from '../entities/task-origin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/modules/companies/entities/company.entity';

@Injectable()
export class OriginsServices {
  constructor(
    @InjectRepository(TaskOrigin)
    private readonly originsRepository: Repository<TaskOrigin>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async getOrigins(
    companyId: string,
    search?: { search?: string; page?: number; pageSize?: number },
  ) {
    if ((search && search.page) || search.pageSize || search.search) {
      const queryBuilder = this.originsRepository.createQueryBuilder('origins');

      if (search.search) {
        const searchParam = `%${search.search || ''}%`;

        queryBuilder.andWhere((qb) => {
          qb.where('origins.name LIKE :searchParam', { searchParam });
        });
      }

      queryBuilder.andWhere('origins.origin_company_fk = :companyId', {
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
    return await this.originsRepository.find({
      where: { company },
    });
  }

  async createOrigin(name: string, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const origin = this.originsRepository.create({
      name,
      company,
    });

    return await this.originsRepository.save(origin);
  }

  async updateOrigin(id: number, name: string, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const origin = await this.originsRepository.findOne({
      where: { id, company },
    });

    if (!origin) {
      throw new Error('Origin not found');
    }

    origin.name = name;

    return await this.originsRepository.save(origin);
  }

  async deleteOrigin(id: number, companyId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
    });

    const origin = await this.originsRepository.findOne({
      where: { id, company },
    });

    if (!origin) {
      throw new Error('Origin not found');
    }

    return await this.originsRepository.remove(origin);
  }
}
