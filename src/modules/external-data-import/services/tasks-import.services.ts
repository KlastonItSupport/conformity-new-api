import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { TasksService } from 'src/modules/tasks/services/tasks.services';
import { DataSource, Repository } from 'typeorm';
import { formatTask } from '../formatters/tasks.formatter';
import { CreateTaskDto } from 'src/modules/tasks/dtos/create-task-payload.dto';
import { formatOrigin } from '../formatters/origin.formatter';
import { TaskOrigin } from 'src/modules/tasks/entities/task-origin.entity';
import { TaskType } from 'src/modules/tasks/entities/task-type.entity';
import { formatType } from '../formatters/types.formatter';
import { TaskClassifications } from 'src/modules/tasks/entities/task-classifications.entity';
import { formatClassification } from '../formatters/classifications.formatter';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { JSDOM } from 'jsdom';

import { Task } from 'src/modules/tasks/entities/task.entity';
import { EvaluatorService } from 'src/modules/tasks-details/services/evaluators.services';
import { formatEvaluator } from '../formatters/evaluator.formatter';
import { formatPrevision } from '../formatters/prevision.formatter';
import { DeadlinesServices } from 'src/modules/tasks-details/services/deadlines.services';
import { CreateReminderPayload } from 'src/modules/reminders/dtos/create-reminder-payload';
import { ReminderService } from 'src/modules/reminders/services/reminder.service';
import { FeedService } from 'src/modules/feed/services/feed.service';
import { formatRootCauseWhy } from '../formatters/format-root-cause-why.formatter';
import { RootCauseAnalysisServices } from 'src/modules/tasks-details/services/root-cause-analysis.services';
import { formatIshikawa } from '../formatters/format-ishikawa.formatter';
import { IshikawaServices } from 'src/modules/tasks-details/services/ishikawa.services';
import { RootCauseServices } from 'src/modules/tasks-details/services/root-cause.services';
import { ImmediateActionsServices } from 'src/modules/tasks-details/services/immediate-actions.services';
import { CreateImmediateActionPayload } from 'src/modules/tasks-details/dtos/create-immediate-action.payload';
import { CorrectiveActionsServices } from 'src/modules/tasks-details/services/corrective-actions.services';
import { CreateCorrectiveActionsPayload } from 'src/modules/tasks-details/dtos/create-corrective-actions.payload';

@Injectable()
export class TasksImportService {
  constructor(
    private readonly tasksService: TasksService,
    @InjectDataSource('externalConnection')
    private connection: DataSource,

    @InjectRepository(TaskOrigin)
    private readonly taskOriginRepository: Repository<TaskOrigin>,

    @InjectRepository(TaskType)
    private readonly typesRepository: Repository<TaskType>,

    @InjectRepository(TaskClassifications)
    private readonly classificationRepository: Repository<TaskClassifications>,

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    private readonly s3Service: S3Service,
    private readonly evaluatorService: EvaluatorService,
    private readonly deadlineService: DeadlinesServices,
    private readonly reminderService: ReminderService,
    private readonly feedService: FeedService,
    private readonly rootCauseWhyService: RootCauseAnalysisServices,
    private readonly ishikawaService: IshikawaServices,
    private readonly rootCauseService: RootCauseServices,
    private readonly immediateActionService: ImmediateActionsServices,
    private readonly correctiveActionService: CorrectiveActionsServices,
  ) {}

  async createOrigin(companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const errors = [];
    const origins = await queryRunner.query(
      `SELECT * FROM selects WHERE empresa = ? AND modulo = ? AND chave = ?`,
      [companyId, 'tasks', 'origens'],
    );

    const originPromise = origins.map(async (origin) => {
      try {
        const originFormatted = formatOrigin(origin);
        const originCreated = this.taskOriginRepository.create(originFormatted);
        return await this.taskOriginRepository.save(originCreated);
      } catch (e) {
        errors.push({ error: e, originId: origin.id });
      }
    });

    return { origins: await Promise.all(originPromise), errors };
  }

  async createTypes(companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const errors = [];
    const types = await queryRunner.query(
      `SELECT * FROM selects WHERE empresa = ? AND modulo = ? AND chave = ?`,
      [companyId, 'tasks', 'tipos'],
    );

    const typePromise = types.map(async (type) => {
      try {
        const typeFormatted = formatType(type);
        const typeCreated = this.typesRepository.create(typeFormatted);
        return await this.typesRepository.save(typeCreated);
      } catch (e) {
        errors.push({ error: e, typeId: type.id });
      }
    });
    return { types: await Promise.all(typePromise), errors };
  }

  async createClassification(companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const errors = [];
    const classifications = await queryRunner.query(
      `SELECT * FROM selects WHERE empresa = ? AND modulo = ? AND chave = ?`,
      [companyId, 'tasks', 'classificacoes'],
    );

    const classificationPromise = classifications.map(
      async (classification) => {
        try {
          const classificationFormatted = formatClassification(classification);
          const classificationCreated = this.classificationRepository.create(
            classificationFormatted,
          );
          return await this.classificationRepository.save(
            classificationCreated,
          );
        } catch (e) {
          errors.push({ error: e, classificationId: classification.id });
        }
      },
    );

    return {
      classifications: await Promise.all(classificationPromise),
      errors,
    };
  }

  async createUploads(companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const errors = [];

    const uploads = await queryRunner.query(
      `
      SELECT *
      FROM uploads
      WHERE modulo = 'tasks'
      AND empresa = ? AND data_upload > '2024-04-24'
        
    `,
      [companyId],
    );

    const uploadPromise = uploads.map(async (upload: any) => {
      try {
        return await this.s3Service.transferObject(
          upload.link,
          `${companyId}/tasks`,
          upload.nome,
          companyId,
          process.env.MODULE_TASKS_ID,
          upload['modulo_key'],
        );
      } catch (e) {
        errors.push({ error: e, uploadId: upload.id });
      }
    });

    return {
      uploads: await Promise.all(uploadPromise),
      errors,
      length: uploads.length,
    };
  }

  async uploadDescription(id: number, companyId: any) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    const imagesArr = [];

    if (task.description && task.description.length > 0) {
      const dom = new JSDOM(task.description);
      const images = Array.from(dom.window.document.querySelectorAll('img'));

      for (const image of images) {
        const link = await this.s3Service.transferObject(
          image.src,
          `${companyId}/tasks`,
          image.src.split('/').pop(),
          companyId,
          process.env.MODULE_TASKS_ID,
          'tasks-description',
        );
        imagesArr.push(link);
        image.src = link;
      }
      task.description = dom.serialize();
      await this.taskRepository.save(task);

      return imagesArr;
    }
  }

  async getEvaluators(taskId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const responsables = await queryRunner.query(
        `SELECT * FROM  tasks_analizadas WHERE task = ?;`,
        [taskId],
      );

      const responsablesPromise = responsables.map(async (responsable) => {
        const formattedResponsable = formatEvaluator(responsable);
        return await this.evaluatorService.createEvaluator(
          formattedResponsable,
        );
      });

      return Promise.all(responsablesPromise);
    } finally {
      await queryRunner.release();
    }
  }

  async getPrevisionsChanges(taskId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const changes = await queryRunner.query(
        `SELECT * FROM tasks_prazos_historico WHERE task = ?;`,
        [taskId],
      );

      const changesPromise = changes.map(async (change) => {
        const deadline = formatPrevision(change);
        return await this.deadlineService.createDeadline(deadline);
      });

      return Promise.all(changesPromise);
    } catch (e) {
      console.log(e);
    } finally {
      await queryRunner.release();
    }
  }

  async getReminders(taskId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const reminders = await queryRunner.query(
        `
        SELECT *
        FROM lembretes
        WHERE modulo = 'tasks' AND chave = ?
      `,
        [taskId],
      );

      const reminderPromise = reminders.map(async (reminder: any) => {
        const reminderFormatted = {
          monday: reminder.segunda,
          tuesday: reminder.terca,
          wednesday: reminder.quarta,
          thursday: reminder.quinta,
          friday: reminder.sexta,
          saturday: reminder.sabado,
          sunday: reminder.domingo,
          status: reminder.status,
          weekDay: reminder.dia_semana,
          hour: reminder.horario,
          frequency: reminder.frequencia,
          text: reminder.texto,
          dataEnd: reminder.data_finalizacao,
          dateLastReminder: reminder.data_ultimo_lembrete,
          createdAt: reminder.data_cadastro,
          module: reminder.modulo,
          key: reminder.chave,
          data: reminder.data_inicio,
        } as CreateReminderPayload;
        return await this.reminderService.createReminder(reminderFormatted);
      });

      return Promise.all(reminderPromise);
    } catch (error) {
      console.error('Erro ao obter lembretes:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTaskFeed(taskId: string) {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();

      const feed = await queryRunner.query(
        `
            SELECT * 
            FROM feed 
            WHERE task = ? 
            ORDER BY id DESC
            `,
        [taskId],
      );

      const feedPromise = feed.map(async (feedItem: any) => {
        const feedFormatted = {
          text: feedItem.texto,
          externalId: feedItem.task,
          user: feedItem.usuario as string,
          moduleId: process.env.MODULE_TASKS_ID,
          userId: feedItem.usuario as string,
          companyId: feedItem.empresa as string,
        };
        return await this.feedService.createFeed(feedFormatted);
      });
      return await Promise.all(feedPromise);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getRootCauseWhy(taskId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const rootCauseWhy = await queryRunner.query(
        'SELECT * FROM tasks_analise WHERE task = ?',
        [taskId],
      );

      const rootCauseWhyPromise = rootCauseWhy.map(async (rootCauseWhyItem) => {
        const rootCauseWhyFormatted = formatRootCauseWhy(rootCauseWhyItem);
        return await this.rootCauseWhyService.createRootCauseAnalysis(
          rootCauseWhyFormatted,
        );
      });

      return Promise.all(rootCauseWhyPromise);
    } catch (error) {
      console.error('Erro ao obter lembretes:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getIshikawa(taskId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const ishikawa = await queryRunner.query(
        'SELECT * FROM tasks_ish WHERE task = ?',
        [taskId],
      );

      const ishikawaPromise = ishikawa.map(async (ishikawaItem) => {
        const ishikawaFormatted = formatIshikawa(ishikawaItem);
        return await this.ishikawaService.createIshikawa(ishikawaFormatted);
      });

      return Promise.all(ishikawaPromise);
    } catch (error) {
      console.error('Erro ao obter lembretes:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getRootCause(taskId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const rootCause = await queryRunner.query(
        'SELECT * FROM task_cr WHERE task = ?',
        [taskId],
      );

      const rootCausePromise = rootCause.map(async (rootCauseItem) => {
        const rootCauseFormatted = {
          id: rootCauseItem.id,
          userId: rootCauseItem.usuario == 0 ? null : rootCauseItem.usuario,
          taskId: rootCauseItem.task,
          rootCause: rootCauseItem.cr,
        };
        return await this.rootCauseService.createRootCause(rootCauseFormatted);
      });

      return Promise.all(rootCausePromise);
    } catch (error) {
      console.error('Erro ao obter lembretes:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getImmediateActions(taskId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const immediateActions = await queryRunner.query(
        `SELECT * FROM acoes_corretivas WHERE task = ? AND imediata != '' ORDER BY data_imediata`,
        [taskId],
      );

      const immediateActionsPromise = immediateActions.map(
        async (immediateAction) => {
          const immediateActionFormatted = {
            taskId: immediateAction.task,
            action: immediateAction.imediata,
            date: immediateAction.data_imediata,
            responsable: immediateAction.responsavel,
          };
          return await this.immediateActionService.createImmediateActions(
            immediateActionFormatted as unknown as CreateImmediateActionPayload,
          );
        },
      );

      return Promise.all(immediateActionsPromise);
    } catch (error) {
      console.error('Erro ao obter lembretes:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getCorrectiveActions(taskId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const correctiveActions = await queryRunner.query(
        `SELECT * FROM acoes_corretivas WHERE task = ? AND corretiva != '' ORDER BY data_corretiva`,
        [taskId],
      );

      const correctiveActionsPromise = correctiveActions.map(
        async (correctiveAction) => {
          const correctiveActionFormatted = {
            taskId: correctiveAction.task,
            action: correctiveAction.corretiva,
            date: correctiveAction.data_corretiva,
            responsable: correctiveAction.responsavel,
            result: correctiveAction.resultado,
          };
          return await this.correctiveActionService.createCorrectiveActions(
            correctiveActionFormatted as unknown as CreateCorrectiveActionsPayload,
          );
        },
      );

      return Promise.all(correctiveActionsPromise);
    } catch (error) {
      console.error('Erro ao obter lembretes:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTasks(companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    const errors = [];

    const tasks = await queryRunner.query(
      'SELECT * FROM tasks WHERE empresa = ?',
      [companyId],
    );

    const originsPromise = this.createOrigin(companyId);
    const typesPromise = this.createTypes(companyId);
    const classificationsPromise = this.createClassification(companyId);
    const uploadsPromise = this.createUploads(companyId);

    const [origin, types, classifications, uploadsAdditionals] =
      await Promise.all([
        originsPromise,
        typesPromise,
        classificationsPromise,
        uploadsPromise,
      ]);

    const taskPromise = tasks.map(async (task) => {
      try {
        const taskFormatted = formatTask(task) as unknown as CreateTaskDto;
        const taskCreated = await this.tasksService.createTask(
          taskFormatted,
          task['usuario'],
          true,
        );
        const [
          uploads,
          evaluators,
          previsions,
          reminders,
          feed,
          rootCauseWhy,
          ishikawa,
          rootCause,
          immediateActions,
          correctiveAction,
        ] = await Promise.all([
          this.uploadDescription(task['id'], companyId),
          this.getEvaluators(task['id']),
          this.getPrevisionsChanges(task['id']),
          this.getReminders(task['id']),
          this.getTaskFeed(task['id']),
          this.getRootCauseWhy(task['id']),
          this.getIshikawa(task['id']),
          this.getRootCause(task['id']),
          this.getImmediateActions(task['id']),
          this.getCorrectiveActions(task['id']),
        ]);
        return {
          taskCreated,
          uploadsDescription: uploads,
          evaluators,
          previsions,
          reminders,
          feed,
          rootCauseWhy,
          ishikawa,
          rootCause,
          immediateActions,
          correctiveAction,
        };
      } catch (e) {
        errors.push({ taskId: task['id'], error: e });
      }
    });

    const tasksCreated = await Promise.all(taskPromise);
    return {
      errors,
      tasksCreated,
      origin,
      types,
      classifications,
      uploadsAdditionals,
    };
  }
}
