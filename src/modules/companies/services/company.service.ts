import { Injectable } from '@nestjs/common';
import { Company } from '../entities/company.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto, PaginationCompanyDto } from '../dtos/dto';
import { AppError } from 'src/errors/app-error';
import { User } from 'src/modules/users/entities/users.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async isSuperAdmin(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    return user.accessRule == 'super-admin';
  }
  async createCompany(companyPayload: CreateCompanyDto, userId: string) {
    const hasCompanyWithThisEmail = await this.companyRepository.findOne({
      where: { email: companyPayload.email },
    });

    const isSuperAdmin = await this.isSuperAdmin(userId);
    if (!isSuperAdmin) {
      throw new AppError('Unauthorized', 401);
    }

    if (hasCompanyWithThisEmail) {
      throw new AppError('An company with this email already exists', 409);
    }

    const company = await this.companyRepository.create(companyPayload);
    return await this.companyRepository.save(company);
  }

  async getCompanies(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<PaginationCompanyDto> {
    const isSuperAdmin = await this.isSuperAdmin(userId);
    if (!isSuperAdmin) {
      throw new AppError('Unauthorized', 401);
    }
    const pagination = new PaginationCompanyDto();

    const searchParam = {
      searchName: `%${search}%`,
    };
    const companies =
      page && limit
        ? await this.companyRepository
            .createQueryBuilder('companies')
            .where('companies.name LIKE :searchName', searchParam)
            .orWhere('companies.email LIKE :searchName', searchParam)
            .orWhere('companies.memory_limit LIKE :searchName', searchParam)
            .orWhere('companies.users_limit LIKE :searchName', searchParam)
            .offset((page - 1) * limit)
            .limit(limit)
            .getManyAndCount()
        : await this.companyRepository
            .createQueryBuilder('companies')
            .where('companies.name LIKE :searchName', searchParam)
            .orWhere('companies.email LIKE :searchName', searchParam)
            .orWhere('companies.memory_limit LIKE :searchName', searchParam)
            .orWhere('companies.users_limit LIKE :searchName', searchParam)
            .getManyAndCount();

    const totalCompanies = companies[1];
    const lastPage = limit ? Math.ceil(totalCompanies / limit) : 1;

    const links = {
      first: 1,
      last: lastPage,
      next: page + 1 > lastPage ? lastPage : page + 1,
      totalPages: limit ? Math.ceil(totalCompanies / limit) : 1,
      currentPage: limit ? page : 1,
      previous: limit ? (page > 1 ? page - 1 : 0) : null,
      totalItems: totalCompanies,
    };

    pagination.items = companies[0];
    pagination.pages = links;

    return pagination;
  }

  async getCompanyUsers(companyId: string, userId: string) {
    const isSuperAdmin = await this.isSuperAdmin(userId);
    if (isSuperAdmin) {
      return this.userRepository.find({ order: { createdAt: 'DESC' } });
    }

    if (!companyId) {
      throw new AppError('You need to send an company id', 401);
    }

    return this.userRepository.find({
      where: { companyId: companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async editCompany(
    companyId: string,
    companyPayload: Partial<CreateCompanyDto>,
  ) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!company) {
      throw new AppError('Company not found', 404);
    }

    Object.assign(company, companyPayload);

    return await this.companyRepository.save(company);
  }
}
