import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from '../dtos/create-lead-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Lead } from '../entities/leads.entity';
import { AppError } from 'src/errors/app-error';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { UsersServices } from 'src/modules/users/services/users.services';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { getFileTypeFromBase64 } from 'src/helpers/files';
import { v4 as uuidv4 } from 'uuid';
import { JSDOM } from 'jsdom';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { Upload } from 'src/modules/shared/entities/upload.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepository: Repository<Lead>,

    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,

    private readonly usersService: UsersServices,
    private readonly s3Service: S3Service,
  ) {}

  async getAll(searchParams: PagesServices, userId: string, companyId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const queryBuilder = this.leadsRepository
      .createQueryBuilder('leads')
      .leftJoinAndSelect('leads.crmCompany', 'crmCompany')
      .leftJoinAndSelect('leads.user', 'user');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('leads.status LIKE :searchParam', {
            searchParam,
          })
            .orWhere('leads.solicitationYear LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.solicitationMonth LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.contract LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.value LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.email LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.reference LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.celphone LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.description LIKE :searchParam', {
              searchParam,
            })
            .orWhere('crmCompany.socialReason LIKE :searchParam', {
              searchParam,
            })
            .orWhere('user.name LIKE :searchParam', {
              searchParam,
            });
        }),
      );
    }

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('leads.companyId = :companyId', {
        companyId,
      });
    }

    if (searchParams.page && searchParams.pageSize) {
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
    }

    const [leads, totalItems] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalItems / searchParams.pageSize)
      : 1;

    const paginationLinks = buildPaginationLinks({
      data: leads,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalItems,
    });

    const itemsFormatted = paginationLinks.items.map((item) => {
      const formattedItem = {
        ...item,
        username: item.user.name,
        crmCompanyName: item.crmCompany.socialReason ?? '',
      };

      delete formattedItem.user;
      delete formattedItem.crmCompany;

      return formattedItem;
    });

    paginationLinks.items = itemsFormatted;
    return paginationLinks;
  }

  async create(data: CreateLeadDto) {
    const lead = this.leadsRepository.create(data);
    const savedLead = await this.leadsRepository.save(lead);

    if (data.description && data.description.length > 0) {
      const dom = new JSDOM(data.description);
      const images = Array.from(dom.window.document.querySelectorAll('img'));

      for (const image of images) {
        const base64Data = image.src.split(';base64,').pop();
        if (!base64Data) continue;

        const fileType = getFileTypeFromBase64(image.src);
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = uuidv4();

        const upload = await this.s3Service.uploadFile({
          file: buffer,
          fileType: fileType,
          fileName: fileName,
          moduleId: process.env.MODULE_CRM_ID,
          companyId: data.companyId,
          id: savedLead.id.toString(),
          path: `${data.companyId}/crm`,
        });
        image.src = upload.link;
      }
      savedLead.description = dom.serialize();
    }

    await this.leadsRepository.save(savedLead);
    const leadSavedWithDescriptionAndRelatiom =
      await this.leadsRepository.findOne({
        where: { id: savedLead.id },
        relations: ['user', 'crmCompany'],
      });

    const formattedItem = {
      ...leadSavedWithDescriptionAndRelatiom,
      username: leadSavedWithDescriptionAndRelatiom.user.name,
      crmCompanyName:
        leadSavedWithDescriptionAndRelatiom?.crmCompany?.socialReason ?? '',
    };

    delete formattedItem.user;
    delete formattedItem.crmCompany;

    return formattedItem;
  }

  async delete(id: number) {
    const lead = await this.leadsRepository.findOne({
      where: { id },
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const uploads = await this.uploadsRepository.find({
      where: {
        moduleId: process.env.MODULE_CRM_ID,
        module: lead.id.toString(),
      },
    });

    for (const upload of uploads) {
      await this.s3Service.deleteFile(upload.path);
      await this.uploadsRepository.remove(upload);
    }

    const leadDeleted = await this.leadsRepository.remove(lead);
    return leadDeleted;
  }

  async edit(id: number, data: Partial<CreateLeadDto>) {
    const lead = await this.leadsRepository.findOne({
      where: { id },
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    Object.assign(lead, data);

    if (data.description && data.description.length > 0) {
      const dom = new JSDOM(data.description);
      const images = Array.from(dom.window.document.querySelectorAll('img'));

      for (const image of images) {
        const base64Data = image.src.split(';base64,').pop();
        if (!base64Data) continue;
        if (image.src.includes('amazonaws')) continue;

        const fileType = getFileTypeFromBase64(image.src);
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = uuidv4();

        const upload = await this.s3Service.uploadFile({
          file: buffer,
          fileType: fileType,
          fileName: fileName,
          moduleId: process.env.MODULE_CRM_ID,
          companyId: lead.companyId,
          id: lead.id.toString(),
          path: `${data.companyId}/crm`,
        });
        image.src = upload.link;
      }
      lead.description = dom.serialize();
    }

    lead.updatedAt = new Date();
    await this.leadsRepository.save(lead);

    const leadEdited = await this.leadsRepository.findOne({
      where: { id },
      relations: ['user', 'crmCompany'],
    });

    const formattedItem = {
      ...leadEdited,
      username: leadEdited.user.name,
      crmCompanyName: leadEdited.crmCompany.socialReason ?? '',
    };

    delete formattedItem.user;
    delete formattedItem.crmCompany;

    return formattedItem;
  }

  async getLeadPerStatus(userId: string, companyId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);
    const companyFilter = userAccessRule.isAdmin ? {} : { companyId };

    const requested = await this.leadsRepository.find({
      where: { ...companyFilter, status: 'solicitado' },
    });
    const refused = await this.leadsRepository.find({
      where: { ...companyFilter, status: 'recusado' },
    });
    const cancelled = await this.leadsRepository.find({
      where: { ...companyFilter, status: 'cancelado' },
    });
    const inProgress = await this.leadsRepository.find({
      where: { ...companyFilter, status: 'em andamento' },
    });

    const completed = await this.leadsRepository.find({
      where: { ...companyFilter, status: 'concluído' },
    });

    const total = await this.leadsRepository.find({
      where: {
        ...companyFilter,
      },
    });

    return {
      requested: requested.length,
      refused: refused.length,
      cancelled: cancelled.length,
      inProgress: inProgress.length,
      completed: completed.length,
      total: total.length,
    };
  }
}
