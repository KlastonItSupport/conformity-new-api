import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadTask } from '../entities/task-lead.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateLeadTaskDto } from '../dtos/create-task-lead.dto';
import { AppError } from 'src/errors/app-error';
import { UsersServices } from 'src/modules/users/services/users.services';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { Lead } from '../entities/leads.entity';
import { v4 as uuidv4 } from 'uuid';
import { JSDOM } from 'jsdom';
import { getFileTypeFromBase64 } from 'src/helpers/files';
import { S3Service } from 'src/modules/shared/services/s3.service';

@Injectable()
export class TasksLeadsService {
  constructor(
    @InjectRepository(LeadTask)
    private readonly leadTaskRepository: Repository<LeadTask>,

    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,

    private readonly usersService: UsersServices,
    private readonly s3Service: S3Service,
  ) {}

  async getAll(
    searchParams: PagesServices,
    userId: string,
    companyId: string,
    leadId?: number,
  ) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const queryBuilder = this.leadTaskRepository
      .createQueryBuilder('leads')
      .leftJoinAndSelect('leads.user', 'user')
      .leftJoinAndSelect('leads.lead', 'leadOriginal')
      .leftJoinAndSelect('leadOriginal.crmCompany', 'crmCompany');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      const positiveSearchParams = ['s', 'si', 'sim'];
      const negativeSearchParams = ['n', 'nã', 'na', 'não', 'nao'];
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('leads.type LIKE :searchParam', {
            searchParam,
          })
            .orWhere('leads.description LIKE :searchParam', {
              searchParam,
            })
            .orWhere('user.name LIKE :searchParam', {
              searchParam,
            })
            .orWhere('crmCompany.socialReason LIKE :searchParam', {
              searchParam,
            })
            .orWhere('leads.time LIKE :searchParam', {
              searchParam,
            });
          if (
            positiveSearchParams.includes(searchParams.search.toLowerCase())
          ) {
            qb.orWhere('leads.completed = :completed', { completed: true });
            qb.orWhere('leads.isReminder = :reminder', { reminder: true });
          } else if (
            negativeSearchParams.includes(searchParams.search.toLowerCase())
          ) {
            qb.orWhere('leads.completed = :completed', { completed: false });
            qb.orWhere('leads.isReminder = :reminder', { reminder: false });
          }
        }),
      );
    }

    if (!userAccessRule.isAdmin) {
      queryBuilder.andWhere('leads.companyId = :companyId', {
        companyId,
      });
    }

    if (leadId) {
      queryBuilder.andWhere('leads.leadId = :leadId', {
        leadId,
      });
    }

    if (searchParams.page && searchParams.pageSize) {
      queryBuilder
        .offset((Number(searchParams.page) - 1) * searchParams.pageSize)
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

    paginationLinks.items = paginationLinks.items.map((taskLead: LeadTask) => {
      const formatted = {
        ...taskLead,
        clientName: taskLead?.lead?.crmCompany?.socialReason ?? '',
        userName: taskLead?.user?.name ?? '',
      };

      delete formatted.lead;
      delete formatted.user;

      return formatted;
    });
    return paginationLinks;
  }

  async getByLeadId(id: number) {
    const taskLead = await this.leadTaskRepository.find({
      where: { leadId: id },
    });

    if (!taskLead) {
      throw new AppError('Task not found', 404);
    }
    return taskLead;
  }

  async createTask(data: CreateLeadTaskDto, isImporting: boolean = false) {
    const taskLead = this.leadTaskRepository.create(data);
    const savedTaskLead = await this.leadTaskRepository.save(taskLead);
    const lead = await this.leadRepository.findOne({
      where: { id: data.leadId },
    });

    if (data.description && data.description.length > 0 && !isImporting) {
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
          companyId: lead.companyId,
          id: savedTaskLead.id.toString(),
          path: `${lead.companyId}/crm`,
        });
        image.src = upload.link;
      }
      savedTaskLead.description = dom.serialize();
    }
    await this.leadTaskRepository.save(taskLead);

    const taskLeadSavedWithDescriptionAndRelation =
      await this.leadTaskRepository.findOne({
        where: { id: savedTaskLead.id },
        relations: ['user', 'lead'],
      });

    const formattedItem = {
      ...taskLeadSavedWithDescriptionAndRelation,
      clientName:
        taskLeadSavedWithDescriptionAndRelation?.lead?.crmCompany
          ?.socialReason ?? '',
      userName: taskLeadSavedWithDescriptionAndRelation?.user?.name ?? '',
    };
    return formattedItem;
  }

  async delete(id: number) {
    const taskLead = await this.leadTaskRepository.findOne({
      where: { id },
    });

    if (!taskLead) {
      throw new AppError('Task lead not found', 404);
    }

    const taskLeadDeleted = await this.leadTaskRepository.remove(taskLead);
    return taskLeadDeleted;
  }

  async edit(id: number, data: Partial<CreateLeadTaskDto>) {
    const taskLead = await this.leadTaskRepository.findOne({
      where: { id },
    });

    if (!taskLead) {
      throw new AppError('Task lead not found', 404);
    }

    delete data.userId;
    delete data.userId;

    Object.assign(taskLead, data);
    const taskLeadEdited = await this.leadTaskRepository.save(taskLead);

    return taskLeadEdited;
  }
}
