import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentAction } from '../entities/action.entity';
import { CreateEquipmentActionDto } from '../dtos/create-action-payload';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { formatDate } from 'src/helpers/date';
import { AppError } from 'src/errors/app-error';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { Upload } from 'src/modules/shared/entities/upload.entity';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(EquipmentAction)
    private readonly equipmentActionsRepository: Repository<EquipmentAction>,

    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
    private readonly s3Service: S3Service,
  ) {}

  async get(
    id: number,
    search?: { search?: string; page?: number; pageSize?: number },
  ) {
    const queryOptions: FindManyOptions<EquipmentAction> = {
      take: search?.pageSize,
      skip: (search?.page - 1) * search?.pageSize,
    };

    if (search?.search) {
      const searchParam = `%${search.search}%`;
      queryOptions.where = [
        { equipmentId: id, type: Like(searchParam) },
        {
          equipmentId: id,
          nextDate: Like(`${formatDate(search.search)}`) as unknown as Date,
        },
        {
          equipmentId: id,
          date: Like(`${formatDate(search.search)}`) as unknown as Date,
        },
        {
          equipmentId: id,
          validity: Like(searchParam),
        },
      ];
    } else {
      queryOptions.where = {
        equipmentId: id,
      };
    }

    const [equipmentActions, totalItems] =
      await this.equipmentActionsRepository.findAndCount(queryOptions);

    const lastPage = search?.pageSize
      ? Math.ceil(totalItems / search.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: equipmentActions,
      lastPage,
      page: search?.page,
      pageSize: search?.pageSize,
      totalData: totalItems,
    });
    return paginationLinks;
  }

  async create(data: CreateEquipmentActionDto, companyId: string) {
    const equipmentAction = this.equipmentActionsRepository.create(data);
    const equipmentActionSaved =
      await this.equipmentActionsRepository.save(equipmentAction);

    if (data.documents) {
      await this.createAdditionalDocuments(
        equipmentActionSaved.id,
        data.documents,
        companyId,
      );
    }
    return equipmentActionSaved;
  }

  async delete(id: number) {
    const equipmentAction = await this.equipmentActionsRepository.findOne({
      where: { id },
    });
    return await this.equipmentActionsRepository.remove(equipmentAction);
  }

  async update(id: number, data: Partial<CreateEquipmentActionDto>) {
    const equipmentAction = await this.equipmentActionsRepository.findOne({
      where: { id },
    });

    if (!equipmentAction) {
      throw new Error(`EquipmentAction not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { equipmentId, ...updateData } = data;

    Object.assign(equipmentAction, updateData);
    return await this.equipmentActionsRepository.save(equipmentAction);
  }

  async createAdditionalDocuments(
    id: number,
    data: ConvertedFile[],
    companyId: string,
  ) {
    const equipment = await this.equipmentActionsRepository.findOne({
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
            companyId: companyId,
            id: equipment.id.toString(),
            path: `${companyId}/equipments`,
          });
          uploads.push(res);
        }),
      );
    }

    return uploads;
  }

  async getDocuments(id: number) {
    const equipmentAction = await this.equipmentActionsRepository.findOne({
      where: { id },
    });

    if (!equipmentAction) {
      throw new AppError(`EquipmentAction not found`, 404);
    }

    const uploads = await this.uploadsRepository.find({
      where: {
        module: equipmentAction.id.toString(),
        moduleId: process.env.MODULE_EQUIPMENTS_ID,
      },
    });

    return uploads;
  }

  async deleteDocuments(documentId: number) {
    const uploads = await this.uploadsRepository.findOne({
      where: {
        id: documentId.toString(),
        moduleId: process.env.MODULE_EQUIPMENTS_ID,
      },
    });
    await this.s3Service.deleteFile(uploads.path);
    return await this.uploadsRepository.remove(uploads);
  }
}
