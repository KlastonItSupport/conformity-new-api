import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { Training } from 'src/modules/trainings/entities/training.entity';
import { TrainingUser } from 'src/modules/user-trainings/entities/user-training.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { UsersServices } from 'src/modules/users/services/users.services';
import { Between, Brackets, MoreThanOrEqual, Repository } from 'typeorm';
import { FiltersMatriz } from '../dtos/matriz-filters';

@Injectable()
export class MatrizService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(TrainingUser)
    private readonly usersTrainingRepository: Repository<TrainingUser>,

    private readonly userServices: UsersServices,
  ) {}

  async get(
    searchParams: PagesServices,
    filters: FiltersMatriz,
    companyId: string,
  ) {
    const whereClause = {
      id: filters.trainingId,
    } as any;
    const companyTrainings = await this.trainingRepository.find({
      where: { companyId, ...whereClause },
      select: ['name', 'id'],
    });

    const usersPaginated = await this.getUsers(
      searchParams,
      filters,
      companyId,
    );
    const users = usersPaginated.items;
    const pages = usersPaginated.pages;

    const columnsName = companyTrainings.map(
      (companyTrainings) => companyTrainings.name,
    );

    const usersTrainings = await this.getUsersTrainings(
      companyTrainings,
      users,
      filters,
    );

    let formattedColumns = columnsName;
    if (filters.userId) {
      formattedColumns = columnsName.filter((columnName) => {
        return usersTrainings.some((userTraining) =>
          userTraining.hasOwnProperty(columnName),
        );
      });
    }
    return { columnsName: formattedColumns, usersTrainings, pages };
  }

  async getUsersTrainings(
    companyTrainings: Training[],
    users: User[],
    filters: FiltersMatriz,
  ) {
    return await Promise.all(
      users.map(async (user: User) => {
        const userTrainings: Record<string, any> = {};

        await Promise.all(
          companyTrainings.map(async (training: Training) => {
            let dateFilter;

            if (filters.initialDate && filters.endDate) {
              dateFilter = Between(filters.initialDate, filters.endDate);
            }
            if (filters.initialDate && !filters.endDate) {
              dateFilter = MoreThanOrEqual(filters.initialDate);
            }
            if (!filters.initialDate && filters.endDate) {
              dateFilter = MoreThanOrEqual(filters.endDate);
            }

            const userHasTraining = await this.usersTrainingRepository.find({
              where: {
                userId: user.id,
                trainingId: training.id,
                date: dateFilter,
              },
              relations: ['training'],
            });

            if (userHasTraining.length > 0) {
              userHasTraining.forEach((trainingRelation) => {
                userTrainings[trainingRelation.training.name] =
                  `${trainingRelation.date}`;

                userTrainings[trainingRelation.training.name + '-id'] =
                  `${trainingRelation.id}`;
              });
            }
          }),
        );

        return {
          username: user.name,
          ...userTrainings,
        };
      }),
    );
  }

  async getUsers(
    searchParams: PagesServices,
    filters: FiltersMatriz,
    companyId: string,
  ) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.trainings', 'usersTrainings');
    queryBuilder.select(['users.id', 'users.name']);
    queryBuilder.where('users.company_id_fk = :companyId', { companyId });

    if (searchParams.search) {
      const searchParam = {
        searchName: `%${searchParams.search}%`,
      };

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('users.name LIKE :searchName', searchParam);
        }),
      );
    }

    if (filters.userId) {
      queryBuilder.andWhere('users.id = :userId', { userId: filters.userId });
    }

    if (filters.trainingId) {
      queryBuilder.andWhere('usersTrainings.trainingId = :trainingId', {
        trainingId: filters.trainingId,
      });
    }

    if (searchParams.page && searchParams.pageSize) {
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
    }

    const users = await queryBuilder.getManyAndCount();

    const totalUsers = users[1];
    const lastPage = searchParams.pageSize
      ? Math.ceil(totalUsers / searchParams.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: users[0],
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalUsers,
    });

    return paginationLinks;
  }
}
