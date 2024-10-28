import { Injectable } from '@nestjs/common';
import { CreateTrainingUserDto } from '../dtos/create-user-training.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingUser } from '../entities/user-training.entity';
import { Repository } from 'typeorm';
import { AppError } from 'src/errors/app-error';
import { UpdateUserTraining } from '../dtos/update-user-training.dto';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { UsersServices } from 'src/modules/users/services/users.services';
import { buildPaginationLinks } from 'src/helpers/pagination';

@Injectable()
export class UserTrainingsService {
  constructor(
    @InjectRepository(TrainingUser)
    private readonly trainingUserRepository: Repository<TrainingUser>,

    private readonly userService: UsersServices,
  ) {}

  async get(searchParams: PagesServices, userId: string) {
    const queryBuilder = this.trainingUserRepository
      .createQueryBuilder('trainingUser')
      .leftJoinAndSelect('trainingUser.training', 'training')
      .where('trainingUser.user = :userId', {
        userId,
      });

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;

      queryBuilder.andWhere('training.name LIKE :searchParam', {
        searchParam,
      });

      queryBuilder.orWhere('training.expirationInMonths LIKE :searchParam', {
        searchParam,
      });
    }

    if (searchParams.page && searchParams.pageSize) {
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
    }

    const [trainings, totalTrainings] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalTrainings / searchParams.pageSize)
      : 1;

    const paginationLinks = await buildPaginationLinks({
      data: trainings,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalTrainings,
    });

    paginationLinks.items = paginationLinks.items.map((item: TrainingUser) =>
      this.format(item),
    );

    return paginationLinks;
  }

  async create(data: CreateTrainingUserDto) {
    const trainingUser = this.trainingUserRepository.create(data);
    return await this.trainingUserRepository.save(trainingUser);
  }

  async update(id: number, data: UpdateUserTraining) {
    const trainingUser = await this.trainingUserRepository.findOne({
      where: { id },
    });

    if (!trainingUser) {
      throw new AppError('Training not found', 404);
    }

    Object.assign(trainingUser, data);
    return await this.trainingUserRepository.save(trainingUser);
  }

  async delete(id: number) {
    const trainingUser = await this.trainingUserRepository.findOne({
      where: { id },
    });

    if (!trainingUser) {
      throw new AppError('Training not found', 404);
    }

    return await this.trainingUserRepository.remove(trainingUser);
  }

  private format(training: TrainingUser) {
    training.expirationInMonths = training?.training?.expirationInMonths;
    training.trainingName = training?.training?.name;

    delete training.training;
    return training;
  }
}
