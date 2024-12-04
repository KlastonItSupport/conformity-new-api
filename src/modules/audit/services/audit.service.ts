import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Audit } from '../entities/audit.entity';
import { AuditDto } from '../dtos/create-audit-payload';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { AppError } from 'src/errors/app-error';
import { User } from 'src/modules/users/entities/users.entity';
import { buildPaginationLinks } from 'src/helpers/pagination';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async store(data: AuditDto): Promise<void> {
    if (data.method === 'valida_email') {
      return;
    }

    const audit = this.auditRepository.create({
      ...data,
      description: this.getComplement(
        data.description,
        data.complement,
        data.key,
      ),
    });
    await this.auditRepository.save(audit);
  }

  getComplement(description: string, complement?: string, id?: any) {
    let complementFormatted = description;

    if (id) {
      complementFormatted = complementFormatted.replace('$id', id);
    }

    if (complement) {
      complementFormatted = complementFormatted.replace(
        '$complement',
        complement,
      );
    }

    return complementFormatted;
  }

  async getAll(searchParams: PagesServices, companyId: string, userId: string) {
    const userAccessRule = await this.getUserAccessRule(userId);
    const queryBuilder = this.auditRepository
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.user', 'user')
      .select([
        'audit.id',
        'audit.module',
        'audit.description',
        'audit.companyId',
        'audit.createdAt',
        'user.name',
      ]);

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('audit.module LIKE :searchParam', {
            searchParam,
          })
            .orWhere('audit.description LIKE :searchParam', { searchParam })
            .orWhere('audit.id LIKE :searchParam', { searchParam })
            .orWhere('user.name LIKE :searchParam', { searchParam });
        }),
      );
    }
    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('audit.companyId = :companyId', {
        companyId,
      });
    }

    if (searchParams.page && searchParams.pageSize) {
      searchParams.pageSize = Number(searchParams.pageSize);
      searchParams.page = Number(searchParams.page);
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
    }

    const [audit, totalItems] = await queryBuilder
      .orderBy('audit.createdAt', 'DESC')
      .getManyAndCount();
    const lastPage = searchParams.pageSize
      ? Math.ceil(totalItems / searchParams.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: audit,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalItems,
    });

    paginationLinks.items = await Promise.all(
      paginationLinks.items.map(async (item: Audit) => {
        return this.format(item);
      }),
    );
    return paginationLinks;
  }

  async getUserAccessRule(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const accessLevels = {
      isAdmin: user.accessRule === 'super-admin',
      isSuperUser: user.accessRule === 'super-user',
      isUser: user.accessRule === 'user',
    };

    return accessLevels;
  }
  async format(audit: Audit) {
    const formatted = {
      ...audit,
      userName: audit.user.name,
    };
    return formatted;
  }
}
