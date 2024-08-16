import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEquipmentDto } from '../dtos/create-equipment-payload';
import { AppError } from 'src/errors/app-error';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { buildPaginationLinks } from 'src/helpers/pagination';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentsRepository: Repository<Equipment>,
    private readonly s3Service: S3Service,
  ) {}

  async create(data: CreateEquipmentDto) {
    const equipment = this.equipmentsRepository.create(data);
    const equipmentSaved = await this.equipmentsRepository.save(equipment);

    return equipmentSaved;
  }

  async delete(id: number) {
    const equipment = await this.equipmentsRepository.findOne({
      where: { id },
    });
    return await this.equipmentsRepository.remove(equipment);
  }

  async update(id: number, data: Partial<CreateEquipmentDto>) {
    const equipment = await this.equipmentsRepository.findOne({
      where: { id },
    });

    if (!equipment) {
      throw new AppError(`Equipment not found`, 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { companyId, ...updateData } = data;

    Object.assign(equipment, updateData);
    return await this.equipmentsRepository.save(equipment);
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

  async get(
    companyId: string,
    search?: { search?: string; page?: number; pageSize?: number },
  ) {
    const queryOptions: any = {
      where: {
        companyId,
      },
      take: search?.pageSize,
      skip: (search?.page - 1) * search?.pageSize,
      relations: ['actions'],
    };

    if (search?.search) {
      const searchParam = `%${search.search}%`;
      queryOptions.where = [
        { companyId, name: Like(searchParam) },
        { companyId, description: Like(searchParam) },
        { companyId, model: Like(searchParam) },
        { companyId, series: Like(searchParam) },
        { companyId, manufacturer: Like(searchParam) },
        { companyId, certified: Like(searchParam) },
        { companyId, range: Like(searchParam) },
        { companyId, tolerancy: Like(searchParam) },
      ];
    }

    const [equipments, totalItems] =
      await this.equipmentsRepository.findAndCount(queryOptions);

    const lastPage = search?.pageSize
      ? Math.ceil(totalItems / search.pageSize)
      : 1;

    const equipmentsFormatted = equipments.map((equipment) => {
      const now = new Date();

      const soonerActions = equipment.actions.filter(
        (action) => new Date(action.nextDate) > now,
      );

      const nextActionDate = soonerActions.reduce(
        (closestDate, action) => {
          const date = new Date(action.nextDate);
          const userTimezoneOffset = date.getTimezoneOffset() * 60000;

          const actionDate = new Date(date.getTime() + userTimezoneOffset);
          if (!closestDate || actionDate < closestDate) {
            return actionDate;
          }
          return closestDate;
        },
        null as Date | null,
      );

      equipment.nextAction =
        nextActionDate == null ? null : this.formatDate(nextActionDate);
      delete equipment.actions;

      return equipment;
    });

    const paginationLinks = buildPaginationLinks({
      data: equipmentsFormatted,
      lastPage,
      page: search?.page,
      pageSize: search?.pageSize,
      totalData: totalItems,
    });

    return paginationLinks;
  }

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
}
