import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from '../dtos/create-school.dto';
import { Repository } from 'typeorm';
import { School } from '../entities/schools.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError } from 'src/errors/app-error';
import { UpdateSchoolDto } from '../dtos/update-schools.dto';
import { UsersServices } from 'src/modules/users/services/users.services';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { buildPaginationLinks } from 'src/helpers/pagination';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolsRepository: Repository<School>,

    private readonly userService: UsersServices,
  ) {}

  async get(searchParams: PagesServices, userId: string, companyId: string) {
    const userAccessRule = await this.userService.getUserAccessRule(userId);
    const queryBuilder = this.schoolsRepository
      .createQueryBuilder('schools')
      .leftJoinAndSelect('schools.company', 'company');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;

      queryBuilder.andWhere('schools.name LIKE :searchParam', { searchParam });

      queryBuilder.orWhere('schools.email LIKE :searchParam', { searchParam });

      queryBuilder.orWhere('schools.celphone LIKE :searchParam', {
        searchParam,
      });

      queryBuilder.orWhere('schools.state LIKE :searchParam', { searchParam });

      queryBuilder.orWhere('schools.city LIKE :searchParam', { searchParam });

      queryBuilder.orWhere('company.name LIKE :searchParam', { searchParam });
    }

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('schools.schools_company_fk = :companyId', {
        companyId,
      });
    }

    if (searchParams.page && searchParams.pageSize) {
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
    }

    const [schools, totalSchools] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalSchools / searchParams.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: schools,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalSchools,
    });

    paginationLinks.items = await Promise.all(
      paginationLinks.items.map(async (item: School) => {
        return this.format(item);
      }),
    );

    return paginationLinks;
  }

  async createSchools(data: CreateSchoolDto) {
    const school = this.schoolsRepository.create(data);
    await this.schoolsRepository.save(school);

    const savedSchool = await this.schoolsRepository.findOne({
      where: { id: school.id },
      relations: ['company'],
    });

    return this.format(savedSchool);
  }

  async delete(id: number) {
    const school = await this.schoolsRepository.findOne({ where: { id } });

    if (!school) {
      throw new AppError('School not found', 404);
    }

    return await this.schoolsRepository.remove(school);
  }

  async edit(data: UpdateSchoolDto, id: number, userId: string) {
    const school = await this.schoolsRepository.findOne({ where: { id } });
    const userAccessRule = await this.userService.getUserAccessRule(userId);

    if (!school) {
      throw new AppError('School not found', 404);
    }

    if (!userAccessRule.isAdmin) {
      delete data.companyId;
    }

    Object.assign(school, data);
    await this.schoolsRepository.save(school);

    const savedSchool = await this.schoolsRepository.findOne({
      where: { id: school.id },
      relations: ['company'],
    });

    return this.format(savedSchool);
  }

  private format(school: School) {
    school.companyName = school.company.name;
    delete school.company;
    return school;
  }
}
