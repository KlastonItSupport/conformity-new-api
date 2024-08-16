import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { Equipment } from '../entities/equipment.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';
import { AppError } from 'src/errors/app-error';
import { Upload } from 'src/modules/shared/entities/upload.entity';
import { buildPaginationLinks } from 'src/helpers/pagination';

@Injectable()
export class AdditionalDocumentsService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Equipment)
    private readonly equipmentsRepository: Repository<Equipment>,
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
  ) {}

  async get(
    companyId: string,
    id: string,
    search?: { search?: string; page?: number; pageSize?: number },
  ) {
    const queryOptions: FindManyOptions<Upload> = {
      take: search?.pageSize,
      skip: (search?.page - 1) * search?.pageSize,
    };

    if (search?.search) {
      const searchParam = `%${search.search}%`;
      queryOptions.where = [{ companyId, module: id, name: Like(searchParam) }];
    } else {
      queryOptions.where = {
        companyId,
        module: id,
      };
    }

    const [uploads, totalItems] =
      await this.uploadsRepository.findAndCount(queryOptions);

    const lastPage = search?.pageSize
      ? Math.ceil(totalItems / search.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: uploads,
      lastPage,
      page: search?.page,
      pageSize: search?.pageSize,
      totalData: totalItems,
    });

    return paginationLinks;
  }

  async createAdditionalDocuments(id: number, data: ConvertedFile[]) {
    const equipment = await this.equipmentsRepository.findOne({
      where: { id },
    });

    if (!equipment) {
      throw new AppError(`Equipment not found`, 404);
    }

    const uploads = [];
    if (data && data.length > 0) {
      await Promise.all(
        data.map(async (file) => {
          const res = await this.s3Service.uploadFile({
            file: Buffer.from(file.base, 'base64'),
            fileType: file.type,
            fileName: file.name,
            moduleId: process.env.MODULE_EQUIPMENTS_ID,
            companyId: equipment.companyId,
            id: equipment.id.toString(),
            path: `${equipment.companyId}/equipments`,
          });
          uploads.push(res);
        }),
      );
    }

    return uploads;
  }

  async delete(id: string) {
    const uploadDocuments = await this.uploadsRepository.findOne({
      where: { id },
    });
    const path = uploadDocuments.path;

    return await this.s3Service.deleteFile(path);
  }
}
