import { Injectable } from '@nestjs/common';
import { CreateServicePayload } from '../dtos/create-service-payload.dto';
import { Service } from '../entities/service.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError } from 'src/errors/app-error';
import { PagesServices } from '../dtos/pages.dto';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { UsersServices } from 'src/modules/users/services/users.services';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly usersService: UsersServices,
  ) {}

  async getAll(searchParams: PagesServices, companyId: string, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);
    const queryBuilder = this.serviceRepository.createQueryBuilder('services');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('services.service LIKE :searchParam', {
            searchParam,
          }).orWhere('services.value LIKE :searchParam', { searchParam });
        }),
      );
    }

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('services.companyId = :companyId', {
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

    const [services, totalItems] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalItems / searchParams.pageSize)
      : 1;
    const paginationLinks = buildPaginationLinks({
      data: services,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalItems,
    });

    return paginationLinks;
  }

  async create(data: CreateServicePayload) {
    const service = this.serviceRepository.create({ ...data });
    return await this.serviceRepository.save(service);
  }

  async delete(id: number) {
    const service = await this.serviceRepository.findOne({ where: { id } });

    if (!service) {
      throw new AppError('Service not found', 404);
    }
    return await this.serviceRepository.remove(service);
  }

  async update(data: Partial<CreateServicePayload>, id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    delete data['id'];
    delete data['companyId'];
    Object.assign(service, data);

    return await this.serviceRepository.save(service);
  }
}
