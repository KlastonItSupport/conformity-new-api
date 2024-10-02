import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadTask } from '../entities/task-lead.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateLeadTaskDto } from '../dtos/create-task-lead.dto';
import { AppError } from 'src/errors/app-error';
import { UsersServices } from 'src/modules/users/services/users.services';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';

@Injectable()
export class TasksLeadsService {
  constructor(
    @InjectRepository(LeadTask)
    private readonly leadTaskRepository: Repository<LeadTask>,

    private readonly usersService: UsersServices,
  ) {}

  async getAll(searchParams: PagesServices, userId: string, companyId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const queryBuilder = this.leadTaskRepository
      .createQueryBuilder('leads')
      .leftJoinAndSelect('leads.user', 'user');

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

    return paginationLinks;
  }

  async createTask(data: CreateLeadTaskDto) {
    const taskLead = this.leadTaskRepository.create(data);
    return await this.leadTaskRepository.save(taskLead);
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
