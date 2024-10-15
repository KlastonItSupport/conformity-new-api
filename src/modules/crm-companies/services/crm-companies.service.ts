import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrmCompany } from '../entities/crm-company.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateCrmCompanyDto } from '../dtos/create-crm-company.dto';
import { AppError } from 'src/errors/app-error';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { UsersServices } from 'src/modules/users/services/users.services';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { capitalizeFirstLetter } from 'src/helpers/string';

@Injectable()
export class CrmServices {
  constructor(
    @InjectRepository(CrmCompany)
    private readonly crmRepository: Repository<CrmCompany>,

    private readonly usersService: UsersServices,
  ) {}

  async getAll(searchParams: PagesServices, userId: string, companyId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);
    const queryBuilder = this.crmRepository.createQueryBuilder('crmCompany');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('crmCompany.socialReason LIKE :searchParam', {
            searchParam,
          })
            .orWhere('crmCompany.clientType LIKE :searchParam', {
              searchParam,
            })
            .orWhere('crmCompany.email LIKE :searchParam', {
              searchParam,
            })
            .orWhere('crmCompany.cnpjCpf LIKE :searchParam', {
              searchParam,
            })
            .orWhere('crmCompany.id LIKE :searchParam', {
              searchParam,
            })
            .orWhere('crmCompany.person_type LIKE :searchParam', {
              searchParam,
            });
        }),
      );
    }

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('crmCompany.companyId = :companyId', {
        companyId,
      });
    }

    if (searchParams.page && searchParams.pageSize) {
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
    }

    const [crmCompanies, totalItems] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalItems / searchParams.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: crmCompanies,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalItems,
    });

    return paginationLinks;
  }

  async create(data: CreateCrmCompanyDto) {
    const crm = this.crmRepository.create({
      ...data,
      client: data.type === 'cliente' ? true : false,
      supplier: data.type === 'fornecedor' ? true : false,
      clientType: capitalizeFirstLetter(data.clientType),
      personType: capitalizeFirstLetter(data.personType),
      cnpjCpf: data.document,
    });
    const savedCrm = await this.crmRepository.save(crm);
    return savedCrm;
  }

  async delete(id: number) {
    const crm = await this.crmRepository.findOne({ where: { id } });

    if (!crm) {
      throw new AppError('Crm not found', 404);
    }

    return await this.crmRepository.remove(crm);
  }

  async edit(id: number, data: Partial<CreateCrmCompanyDto>) {
    const crm = await this.crmRepository.findOne({ where: { id } });

    if (!crm) {
      throw new AppError('Crm not found', 404);
    }

    if (data.document) {
      crm.cnpjCpf = data.document;
    }

    delete data.companyId;
    Object.assign(crm, data);

    const saved = await this.crmRepository.save(crm);
    const savedCrmFomatted = saved;

    if (data.clientType) {
      savedCrmFomatted.clientType = capitalizeFirstLetter(data.clientType);
    }

    if (data.personType) {
      savedCrmFomatted.personType = capitalizeFirstLetter(data.personType);
    }

    return savedCrmFomatted;
  }
}
