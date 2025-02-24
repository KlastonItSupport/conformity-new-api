import { Injectable } from '@nestjs/common';
import { CreateTrainingPayload } from '../dtos/create-training-payload';
import { InjectRepository } from '@nestjs/typeorm';
import { Training } from '../entities/training.entity';
import { Repository } from 'typeorm';
import { AppError } from 'src/errors/app-error';
import { UpdateTraining } from '../dtos/update-training.dto';
import { UsersServices } from 'src/modules/users/services/users.services';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { buildPaginationLinks } from 'src/helpers/pagination';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,

    private readonly userService: UsersServices,
  ) {}

  async get(searchParams: PagesServices, userId: string, companyId: string) {
    const userAccessRule = await this.userService.getUserAccessRule(userId);
    const queryBuilder = this.trainingRepository
      .createQueryBuilder('trainings')
      .leftJoinAndSelect('trainings.company', 'company')
      .leftJoinAndSelect('trainings.school', 'school');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;

      queryBuilder.andWhere('trainings.name LIKE :searchParam', {
        searchParam,
      });

      queryBuilder.orWhere('school.name LIKE :searchParam', { searchParam });

      queryBuilder.orWhere('company.name LIKE :searchParam', { searchParam });

      queryBuilder.orWhere('trainings.expirationInMonths LIKE :searchParam', {
        searchParam,
      });
    }

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('trainings.trainings_company_fk = :companyId', {
        companyId,
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

    paginationLinks.items = paginationLinks.items.map((item: Training) =>
      this.format(item),
    );

    return paginationLinks;
  }

  async create(data: CreateTrainingPayload) {
    if (!data.expirationInMonths) {
      delete data.expirationInMonths;
    }
    const training = this.trainingRepository.create(data);
    const savedTraining = await this.trainingRepository.save(training);

    return this.format(
      await this.trainingRepository.findOne({
        where: { id: savedTraining.id },
        relations: ['school', 'company'],
      }),
    );
  }

  async delete(id: number) {
    const training = await this.trainingRepository.findOne({ where: { id } });

    if (!training) {
      throw new AppError('Training not found', 404);
    }

    return await this.trainingRepository.remove(training);
  }

  async update(id: number, data: UpdateTraining, userId: string) {
    const training = await this.trainingRepository.findOne({ where: { id } });

    if (!training) {
      throw new AppError('Training not found', 404);
    }

    const userAccessRule = await this.userService.getUserAccessRule(userId);

    if (!userAccessRule.isAdmin) {
      delete data.companyId;
    }

    Object.assign(training, data);
    await this.trainingRepository.save(training);

    const savedTraining = await this.trainingRepository.findOne({
      where: { id },
      relations: ['school', 'company'],
    });

    return this.format(savedTraining);
  }

  format(training: Training) {
    training.schoolName = training?.school?.name;
    training.companyName = training?.company?.name;

    delete training.company;
    delete training.school;

    return training;
  }
}
