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
import ConvertedFile from 'src/modules/shared/dtos/converted-file';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { Upload } from 'src/modules/shared/entities/upload.entity';

@Injectable()
export class UserTrainingsService {
  constructor(
    @InjectRepository(TrainingUser)
    private readonly trainingUserRepository: Repository<TrainingUser>,

    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    private readonly userService: UsersServices,
    private readonly s3Service: S3Service,
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
    const savedTraining = await this.trainingUserRepository.save(trainingUser);

    return this.format(
      await this.trainingUserRepository.findOne({
        where: { id: savedTraining.id },
        relations: ['training'],
      }),
    );
  }

  async update(id: number, data: UpdateUserTraining) {
    const trainingUser = await this.trainingUserRepository.findOne({
      where: { id },
    });

    if (!trainingUser) {
      throw new AppError('Training not found', 404);
    }

    Object.assign(trainingUser, data);
    await this.trainingUserRepository.save(trainingUser);

    return this.format(
      await this.trainingUserRepository.findOne({
        where: { id },
        relations: ['training'],
      }),
    );
  }

  async delete(id: number) {
    const trainingUser = this.format(
      await this.trainingUserRepository.findOne({
        where: { id },
        relations: ['training'],
      }),
    );

    if (!trainingUser) {
      throw new AppError('Training not found', 404);
    }

    await this.trainingUserRepository.remove(trainingUser);
    return trainingUser;
  }

  async uploadCertificates(
    documents: ConvertedFile[],
    id: number,
    companyId: string,
  ) {
    const uploads = [];
    if (documents && documents.length > 0) {
      await Promise.all(
        documents.map(async (file) => {
          uploads.push(
            await this.s3Service.uploadFile({
              file: Buffer.from(file.base, 'base64'),
              fileType: file.type,
              fileName: file.name,
              moduleId: process.env.MODULE_TRAINING_ID,
              companyId: companyId,
              id: id.toString(),
              path: `${companyId}/trainings`,
            }),
          );
        }),
      );
    }
    return uploads;
  }

  async getCertificates(id: number, searchParams: PagesServices) {
    const queryBuilder = this.uploadRepository
      .createQueryBuilder('upload')
      .where({
        moduleId: process.env.MODULE_TRAINING_ID,
        module: id.toString(),
      });

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;

      queryBuilder.andWhere('upload.name LIKE :searchParam', {
        searchParam,
      });
    }

    if (searchParams.page && searchParams.pageSize) {
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
    }

    const [uploads, totalUploads] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalUploads / searchParams.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: uploads,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalUploads,
    });

    return paginationLinks;
  }

  async deleteCertificate(id: number) {
    const uploads = await this.uploadRepository.findOne({
      where: {
        moduleId: process.env.MODULE_TRAINING_ID,
        id: id.toString(),
      },
    });

    if (!uploads) {
      throw new AppError('Certificate not found', 404);
    }

    await this.s3Service.deleteFile(uploads.path);
    return await this.uploadRepository.remove(uploads);
  }

  async getCertificatesDetails(id: number) {
    const training = await this.trainingUserRepository.findOne({
      where: { id },
      relations: ['training', 'user'],
    });

    const formattedDetails = {
      userName: training?.user?.name,
      date: training?.date,
      name: training?.training?.name,
    };

    return formattedDetails;
  }

  private format(training: TrainingUser) {
    training.expirationInMonths = training?.training?.expirationInMonths;
    training.trainingName = training?.training?.name;

    delete training.training;
    return training;
  }
}
