import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task-payload.dto';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Task } from '../entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JSDOM } from 'jsdom';
import { getFileTypeFromBase64 } from 'src/helpers/files';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { TaskType } from '../entities/task-type.entity';
import { TaskOrigin } from '../entities/task-origin.entity';
import { AppError } from 'src/errors/app-error';
import { UpdateTaskDto } from '../dtos/update-task-payload.dto';
import { UsersServices } from 'src/modules/users/services/users.services';
import { PermissionsServices } from 'src/modules/permissions/services/permissions.service';
import { PagesParamsTasks } from '../dtos/pages.dto';
import { TasksSearchParams } from '../dtos/search-params.dto';
import { PaginationTasksDto } from '../dtos/pagination-tasks.dto';
import { CreateAdditionalDocumentsDto } from '../dtos/create-additional-document.dto';
import { Upload } from 'src/modules/shared/entities/upload.entity';
import { IndicatorTasks } from 'src/modules/indicators/entities/indicator-tasks.entity';
import { TemplateService } from 'src/modules/mailer/services/template.service';
import { User } from 'src/modules/users/entities/users.entity';
import * as moment from 'moment';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    @InjectRepository(TaskType)
    private taskTypesRepository: Repository<TaskType>,

    @InjectRepository(TaskOrigin)
    private taskOriginsRepository: Repository<TaskOrigin>,

    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(IndicatorTasks)
    private readonly indicatorTasksRepository: Repository<IndicatorTasks>,

    private readonly s3Service: S3Service,
    private readonly usersService: UsersServices,
    private readonly permissionsService: PermissionsServices,
    private readonly mailTemplateService: TemplateService,
  ) {}

  async getTasks(
    userId,
    companyId,
    pages: PagesParamsTasks,
    searchParams: TasksSearchParams,
  ) {
    pages.page = Number(pages.page);
    pages.pageSize = Number(pages.pageSize);

    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_TASKS_ID,
      userId,
    );

    const isAllowedToGetTasks =
      userPermissions.canRead ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToGetTasks) {
      throw new AppError('Not Authorized to get tasks', 401);
    }

    const pagination = new PaginationTasksDto();

    const queryBuilder = this.tasksRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.taskEvaluators', 'evaluators');

    if (!userAccessRule.isAdmin) {
      queryBuilder.where('tasks.tasks_company_fk = :companyId', {
        companyId,
      });
    }

    if (!userAccessRule.isAdmin && !userAccessRule.isSuperUser) {
      queryBuilder
        .andWhere('evaluators.task_evaluator_task_fk = tasks.id')
        .andWhere('evaluators.task_evaluator_user_fk = :userId', {
          userId,
        });
    }

    if (pages.search || Object.keys(searchParams).length > 0) {
      this.handlingFilters(queryBuilder, pages.search, searchParams);
    }

    if (pages.page && pages.pageSize) {
      pages.pageSize = Number(pages.pageSize);
      pages.page = Number(pages.page);
      queryBuilder
        .offset((pages.page - 1) * pages.pageSize)
        .limit(pages.pageSize);
    }

    const tasks = await queryBuilder.getManyAndCount();

    const totalTasks = tasks[1];
    const lastPage = pages.pageSize
      ? Math.ceil(totalTasks / pages.pageSize)
      : 1;

    const links = {
      first: 1,
      last: lastPage,
      next: pages.page + 1 > lastPage ? lastPage : pages.page + 1,
      totalPages: pages.pageSize ? Math.ceil(totalTasks / pages.pageSize) : 1,
      currentPage: pages.pageSize ? pages.page : 1,
      previous: pages.pageSize ? (pages.page > 1 ? pages.page - 1 : 0) : null,
      totalItems: totalTasks,
    };

    pagination.items = tasks[0].map((task) => {
      const taskFormatted = {
        ...task,
        origin: task.origin?.name,
        originId: task.origin?.id,
        classification: task.classification?.name,
        classificationId: task.classification?.id,
        type: task.type?.name,
        typeId: task.type?.id,
      };
      delete taskFormatted.project;
      return taskFormatted;
    });
    pagination.pages = links;

    return pagination;
  }

  async getSpecificTask(id: number, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_TASKS_ID,
      userId,
    );

    const isAllowedToGetTask =
      userPermissions.canRead ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToGetTask) {
      throw new AppError('Not Authorized to get tasks', 401);
    }

    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['origin', 'classification', 'type', 'user', 'project'],
    });

    const formattedTask = {
      ...task,
      responsable: task.user?.name,
      origin: task.origin?.name,
      classification: task.classification?.name,
      type: task.type?.name,
      projectName: task.project?.title,
    };

    delete formattedTask.project;
    return formattedTask;
  }

  async createTask(data: CreateTaskDto, userId: string, isImporting = false) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_TASKS_ID,
      userId,
    );

    const isAllowedToCreateTask =
      userPermissions.canAdd ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToCreateTask && !isImporting) {
      throw new AppError('Not Authorized to create tasks', 401);
    }

    const task = this.tasksRepository.create({
      ...data,
    });

    data.companyId = data['company'];
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
          moduleId: process.env.MODULE_TASKS_ID,
          companyId: data.companyId,
          id: 'tasks-description',
          path: `${data.companyId}/tasks`,
        });
        image.src = upload.link;
      }
      task.description = dom.serialize();
    }
    const savedTask = await this.tasksRepository.save(task);
    const taskOnDb = await this.tasksRepository.findOne({
      where: { id: savedTask.id },
      relations: ['origin', 'classification', 'type', 'user'],
    });

    if (data.indicator) {
      const taskIndicator = this.indicatorTasksRepository.create({
        taskId: savedTask.id,
        indicatorId: data.indicator,
      });

      await this.indicatorTasksRepository.save(taskIndicator);
    }

    if (taskOnDb) {
      await this.handlingTemplateEmail(taskOnDb, userId);

      return {
        ...taskOnDb,
        origin: taskOnDb.origin?.name,
        classification: taskOnDb.classification?.name,
        type: taskOnDb.type?.name,
        indicator: data.indicator,
      };
    }
  }

  async closeTask(id: number) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['user', 'classification', 'type', 'origin'],
    });

    const author = await this.userRepository.findOne({
      where: { id: task.userId },
      relations: ['company'],
    });

    // Faltando mandar o email para cada um dos avaliadores
    await this.mailTemplateService.setUpTemplate(
      task.status === 'Fechada' ? 'task-reaberta' : 'task-encerrar',
      {
        task: {
          id: task.id,
          titulo: task.title,
          usuario: author.name,
          classificacao: task?.classification.name,
          tipo: task?.type.name,
          data_previsao: moment(task.datePrevision as unknown as Date).format(
            'DD/MM/YYYY',
          ),
          origem: task?.origin.name,
          descricao: task.description,
        },
        url: {
          task: process.env.FRONT_BASE_URL + 'tasks/?details?id=' + task.id,
        },
        empresa: {
          nome: author?.company.name,
        },
        usuario: {
          nome: author.name,
        },
      },
      author.email,
    );

    if (task.status === 'Fechada') {
      task.status = 'Aberta';
      return await this.tasksRepository.save(task);
    }
    if (task.status === 'Aberta') {
      task.status = 'Fechada';
      return await this.tasksRepository.save(task);
    }
  }
  async updateTask(id: number, data: UpdateTaskDto, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_TASKS_ID,
      userId,
    );

    const isAllowedToEditTask =
      userPermissions.canEdit ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToEditTask) {
      throw new AppError('Not Authorized to edit tasks', 401);
    }
    const task = await this.tasksRepository.findOne({ where: { id } });
    data.companyId = data['company'];

    if (!task) {
      throw new AppError(`Task with ID ${id} not found`, 404);
    }

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
          moduleId: process.env.MODULE_DOCUMENTS_ID,
          companyId: data.companyId,
          id: 'empty',
          path: `${data.companyId}/tasks`,
        });
        image.src = upload.link;
      }
      data.description = dom.serialize();
      task.description = data.description;
    }

    Object.assign(task, data);
    const savedTask = await this.tasksRepository.save(task);

    const taskOnDb = await this.tasksRepository.findOne({
      where: { id: savedTask.id },
      relations: ['origin', 'classification', 'type'],
    });

    if (taskOnDb) {
      return {
        ...taskOnDb,
        origin: taskOnDb.origin?.name,
        originId: taskOnDb.origin?.id,
        classification: taskOnDb.classification?.name,
        classificationId: taskOnDb.classification?.id,
        type: taskOnDb.type?.name,
        typeId: taskOnDb.type?.id,
      };
    }
    return savedTask;
  }

  async deleteTask(taskId: number, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_DOCUMENTS_ID,
      userId,
    );

    const isAllowedToDeleteTask =
      userPermissions.canDelete ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToDeleteTask) {
      throw new AppError('Not Authorized to delete tasks', 401);
    }
    const task = await this.tasksRepository.findOne({ where: { id: taskId } });
    return await this.tasksRepository.remove(task);
  }

  async handlingFilters(
    queryBuilder: SelectQueryBuilder<Task>,
    search: string,
    searchSelects: TasksSearchParams,
  ) {
    const searchParam = { searchName: `%${search}%` };

    // Realizar junções
    queryBuilder
      .leftJoinAndSelect('tasks.origin', 'origin')
      .leftJoinAndSelect('tasks.classification', 'classification')
      .leftJoinAndSelect('tasks.project', 'project')
      .leftJoinAndSelect('tasks.type', 'type');

    const hasSearchSelects =
      searchSelects &&
      Object.values(searchSelects).some((value) => value !== undefined);

    if (hasSearchSelects) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (searchSelects.origin) {
            qb.andWhere('origin.id LIKE :originId', {
              originId: `%${searchSelects.origin}%`,
            });
          }

          if (searchSelects.classification) {
            qb.andWhere('classification.id LIKE :classificationId', {
              classificationId: `%${searchSelects.classification}%`,
            });
          }
          if (searchSelects.projectId) {
            qb.andWhere('project.id LIKE :projectId', {
              projectId: searchSelects.projectId,
            });
          }
          if (searchSelects.type) {
            qb.andWhere('type.id LIKE :typeId', {
              typeId: `%${searchSelects.type}%`,
            });
          }
          if (searchSelects.status) {
            qb.andWhere('tasks.status LIKE :status', {
              status: `%${searchSelects.status}%`,
            });
          }
        }),
      );
    }

    if (!hasSearchSelects) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('tasks.id LIKE :searchName', searchParam)
            .orWhere('tasks.title LIKE :searchName', searchParam)
            .orWhere('tasks.responsable LIKE :searchName', searchParam)
            .orWhere('tasks.description LIKE :searchName', searchParam)
            .orWhere('tasks.status LIKE :searchName', searchParam)
            .orWhere('origin.name LIKE :searchName', searchParam)
            .orWhere('classification.name LIKE :searchName', searchParam)
            .orWhere('type.name LIKE :searchName', searchParam);
        }),
      );
    }
  }

  async createAdditionalDocuments(data: CreateAdditionalDocumentsDto) {
    const userAccessRule = await this.usersService.getUserAccessRule(
      data.userId,
    );

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_TASKS_ID,
      data.userId,
    );

    const isAllowedToCreateTask =
      userPermissions.canAdd ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToCreateTask) {
      throw new AppError('Not Authorized to create tasks', 401);
    }

    const uploads = [];
    await Promise.all(
      data.documents.map(async (file) => {
        const res = await this.s3Service.uploadFile({
          file: Buffer.from(file.base, 'base64'),
          fileType: file.type,
          fileName: file.name,
          moduleId: process.env.MODULE_TASKS_ID,
          companyId: data.companyId,
          id: data.taskId.toString(),
          path: `${data.companyId}/tasks`,
        });
        uploads.push(res);
      }),
    );
    return uploads;
  }

  async deleteAdditionalDocuments(id: string, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_TASKS_ID,
      userId,
    );

    const isAllowedToDelete =
      userPermissions.canDelete ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToDelete) {
      throw new AppError('Not Authorized to delete', 401);
    }

    const aditionalDocument = await this.uploadRepository.findOne({
      where: { id, moduleId: process.env.MODULE_TASKS_ID },
    });

    if (!aditionalDocument) {
      throw new AppError('Document not found', 404);
    }

    const resS3 = await this.s3Service.deleteFile(aditionalDocument.path);

    if (resS3) {
      await this.uploadRepository.remove(aditionalDocument);
    }

    return aditionalDocument;
  }

  async getAdditionalDocuments(taskId: string, userId: string) {
    const userAccessRule = await this.usersService.getUserAccessRule(userId);

    const userPermissions = await this.permissionsService.getModulePermissions(
      process.env.MODULE_TASKS_ID,
      userId,
    );

    const isAllowedToGetTask =
      userPermissions.canRead ||
      userAccessRule.isAdmin ||
      userAccessRule.isSuperUser;

    if (!isAllowedToGetTask) {
      throw new AppError('Not Authorized to get tasks', 401);
    }

    const additionalDocuments = await this.uploadRepository.find({
      where: { moduleId: process.env.MODULE_TASKS_ID, module: taskId },
    });

    return additionalDocuments;
  }

  private async handlingTemplateEmail(task: Task, userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['company'],
    });
    await this.mailTemplateService.setUpTemplate(
      'task-nova',
      {
        task: {
          id: task.id,
          titulo: task.title,
          usuario: user.name,
          classificacao: task.classification.name,
          tipo: task.type.name,
          data_previsao: moment(task.datePrevision as unknown as Date).format(
            'DD/MM/YYYY',
          ),
          origem: task.origin.name,
        },
        url: {
          task: process.env.FRONT_BASE_URL + 'tasks/?details?id=' + task.id,
        },
        empresa: {
          nome: user.company.name,
        },
        usuario: {
          nome: user.name,
        },
      },
      user.email,
    );
  }
}
