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
import { UsersServices } from 'src/modules/users/services/users.services';
import { JSDOM } from 'jsdom';
import { v4 as uuidv4 } from 'uuid';
import { getFileTypeFromBase64 } from 'src/helpers/files';
import { S3Service } from 'src/modules/shared/services/s3.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    private readonly s3Service: S3Service,
    private readonly userService: UsersServices,
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

    if (searchParams.page && searchParams.pageSize) {
      queryBuilder
        .offset((searchParams.page - 1) * searchParams.pageSize)
        .limit(searchParams.pageSize);
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
        clientName: project.crmCompany.socialReason,
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
    const projectOnDb = await this.projectRepository.save(project);

    const projectWithRelation = await this.projectRepository.findOne({
      where: { id: projectOnDb.id },
      relations: ['crmCompany'],
    });

    if (data.text && data.text.length > 0) {
      const dom = new JSDOM(data.text);
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
          id: projectWithRelation.id.toString(),
          path: `${data.companyId}/projects`,
        });
        image.src = upload.link;
      }

      projectWithRelation.text = dom.serialize();
    }

    const formattedProject = {
      ...projectWithRelation,
      clientName: projectWithRelation.crmCompany?.socialReason,
    };
    delete formattedProject.crmCompany;

    return formattedProject;
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
    delete data['id'];

    Object.assign(project, data);
    if (data.text && data.text.length > 0) {
      const dom = new JSDOM(data.text);
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
          companyId: project.companyId,
          id: project.id.toString(),
          path: `${project.companyId}/projects`,
        });
        image.src = upload.link;
      }

      project.text = dom.serialize();
    }
    await this.projectRepository.save(project);

    const editedProject = await this.projectRepository.findOne({
      where: { id },
      relations: ['crmCompany'],
    });

    const formattedProject = {
      ...editedProject,
      clientName: editedProject.crmCompany?.socialReason,
    };
    delete formattedProject.crmCompany;

    return formattedProject;
  }

  async updateProgress(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project.updateProgressAutomatically) {
      return project.progress;
    }

    const tasks = await this.tasksRepository.find({
      where: { projectId: id },
    });

    if (tasks.length === 0) {
      return 0;
    }

    const completedTasks = tasks.filter((task) => task.status === 'Fechada');

    const progress = (completedTasks.length / tasks.length) * 100;

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    project.progress = Math.floor(progress).toString();
    await this.projectRepository.save(project);

    return Math.floor(progress);
  }

  async getProjectsByStatus(companyId: string, userId: string) {
    const userAccessRule = await this.userService.getUserAccessRule(userId);
    const companyFilter = userAccessRule.isAdmin ? {} : { companyId };

    const startedProjects = await this.projectRepository.find({
      where: { ...companyFilter, status: 'Iniciado' },
    });

    const stopProjects = await this.projectRepository.find({
      where: { ...companyFilter, status: 'Parado' },
    });

    const endedProjects = await this.projectRepository.find({
      where: {
        ...companyFilter,
        status: 'Finalizado',
      },
    });

    const inProgressProjects = await this.projectRepository.find({
      where: {
        ...companyFilter,
        status: 'Em andamento',
      },
    });

    return {
      started: startedProjects.length,
      stopped: stopProjects.length,
      ended: endedProjects.length,
      inProgress: inProgressProjects.length,
    };
  }
}
