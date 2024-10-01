import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from '../dtos/create-lead-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Lead } from '../entities/leads.entity';
import { AppError } from 'src/errors/app-error';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { UsersServices } from 'src/modules/users/services/users.services';
import { buildPaginationLinks } from 'src/helpers/pagination';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepository: Repository<Lead>,

    private readonly usersService: UsersServices,
  ) {}

  async getAll(searchParams: PagesServices, userId: string, companyId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const queryBuilder = this.leadsRepository
      .createQueryBuilder('leads')
      .leftJoinAndSelect('leads.crmCompany', 'crmCompany')
      .leftJoinAndSelect('leads.user', 'user');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('leads.status LIKE :searchParam', {
            searchParam,
          })
            .orWhere('leads.solicitationYear LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.solicitationMonth LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.contract LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.value LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.email LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.reference LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.celphone LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.description LIKE :searchParam', {
              searchParam,
            })
            .orWhere('crmCompany.socialReason LIKE :searchParam', {
              searchParam,
            })
            .orWhere('user.name LIKE :searchParam', {
              searchParam,
            });
        }),
      );
    }

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('leads.companyId = :companyId', {
        companyId,
      });
    }

    const [leads, totalItems] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalItems / searchParams.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: leads,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalItems,
    });

    const itemsFormatted = paginationLinks.items.map((item) => {
      const formattedItem = {
        ...item,
        username: item.user.name,
        crmCompanyName: item.crmCompany.fantasyName,
      };

      delete formattedItem.user;
      delete formattedItem.crmCompany;

      return formattedItem;
    });

    paginationLinks.items = itemsFormatted;
    return paginationLinks;
  }

  async create(data: CreateLeadDto) {
    const lead = this.leadsRepository.create(data);
    return await this.leadsRepository.save(lead);
  }

  async delete(id: number) {
    const lead = await this.leadsRepository.findOne({
      where: { id },
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const leadDeleted = await this.leadsRepository.remove(lead);
    return leadDeleted;
  }

  async edit(id: number, data: Partial<CreateLeadDto>) {
    const lead = await this.leadsRepository.findOne({
      where: { id },
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    Object.assign(lead, data);
    const leadEdited = await this.leadsRepository.save(lead);

    return leadEdited;
  }
}
