import { Injectable } from '@nestjs/common';
import { Roles } from '../entities/departament.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async createCategory(data: CreateRoleDto) {
    const departament = this.roleRepository.create(data);
    const savedDpartament = await this.roleRepository.save(departament);
    return savedDpartament;
  }

  async findAll(companyId: string, searchParams: PagesServices) {
    const queryBuilder = this.roleRepository.createQueryBuilder('roles');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere('roles.name LIKE :searchParam', {
        searchParam,
      });
    }

    if (searchParams.pageSize && searchParams.page) {
      queryBuilder
        .limit(searchParams.pageSize)
        .offset((searchParams.page - 1) * searchParams.pageSize);
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

  async delete(id: number) {
    const departament = await this.roleRepository.findOne({
      where: { id: id },
    });

    if (!departament) {
      throw new AppError('Role not found', 404);
    }
    return await this.roleRepository.remove(departament);
  }

  async update(id: number, name: string) {
    const departament = await this.roleRepository.findOne({
      where: { id: id },
    });

    if (!departament) {
      throw new AppError('Role not found', 404);
    }

    departament.name = name;
    return await this.roleRepository.save(departament);
  }
}
