import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateProjectPayloadDto } from '../dtos/create-project-payload.dto';
import { AppError } from 'src/errors/app-error';
import { PagesServices } from 'src/modules/services/dtos/pages.dto';
import { buildPaginationLinks } from 'src/helpers/pagination';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Document } from 'src/modules/documents/entities/document.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async getAll(
    searchParams: PagesServices,
    searchSelects: { clientSupplier: string; status: string },
  ) {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.crmCompany', 'crmCompany');

    if (searchParams.search) {
      const searchParam = `%${searchParams.search}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('projects.title LIKE :searchParam', {
            searchParam,
          })
            .orWhere('projects.text LIKE :searchParam', { searchParam })
            .orWhere('projects.progress LIKE :searchParam', {
              searchParam,
            })
            .orWhere('projects.status LIKE :searchParam', {
              searchParam,
            })
            .orWhere('crmCompany.fantasyName LIKE :searchParam', {
              searchParam,
            });
        }),
      );
    }

    if (searchSelects.clientSupplier) {
      queryBuilder.andWhere('crmCompany.id LIKE :clientSupplier', {
        clientSupplier: `%${searchSelects.clientSupplier}%`,
      });
    }

    if (searchSelects.status) {
      queryBuilder.andWhere('projects.status LIKE :status', {
        status: `%${searchSelects.status}%`,
      });
    }

    const [projects, totalItems] = await queryBuilder.getManyAndCount();

    const lastPage = searchParams.pageSize
      ? Math.ceil(totalItems / searchParams.pageSize)
      : 1;
    const paginationLinks = buildPaginationLinks({
      data: projects,
      lastPage,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      totalData: totalItems,
    });

    const formattedItemsPromise = projects.map(async (project) => {
      const formattedItem = {
        ...project,
        clientName: project.crmCompany.fantasyName,
        progress: await this.updateProgress(project.id),
      };
      delete formattedItem.crmCompany;
      return formattedItem;
    });

    paginationLinks.items = await Promise.all(formattedItemsPromise);
    return paginationLinks;
  }

  async create(data: CreateProjectPayloadDto) {
    const project = this.projectRepository.create(data);
    return await this.projectRepository.save(project);
  }

  async delete(id: string) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return await this.projectRepository.remove(project);
  }

  async edit(id: string, data: Partial<CreateProjectPayloadDto>) {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    delete data.companyId;
    delete data.crmCompanyId;
    delete data['id'];

    Object.assign(project, data);
    return await this.projectRepository.save(project);
  }

  async updateProgress(id: string) {
    const tasks = await this.tasksRepository.find({
      where: { project: id },
    });

    if (tasks.length === 0) {
      return 0;
    }

    const completedTasks = tasks.filter((task) => task.status === 'Fechada');

    const progress = (completedTasks.length / tasks.length) * 100;

    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    project.progress = Math.floor(progress).toString();
    await this.projectRepository.save(project);

    return Math.floor(progress);
  }
}
