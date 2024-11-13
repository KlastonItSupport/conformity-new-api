import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/modules/categories/services/categories.services';
import { DepartamentPermissionsService } from 'src/modules/departaments-permissions/services/departament-permissions.services';
import { Departament } from 'src/modules/departaments/entities/departament.entity';
import { DepartamentService } from 'src/modules/departaments/services/departament.services';
import { DocumentRelatedsService } from 'src/modules/document-relateds/services/document-relateds.services';
import { DocumentRevisionService } from 'src/modules/document-revisions/services/document-revision.services';
import { DocumentsService } from 'src/modules/documents/services/documents.service';
import { EvaluatorService } from 'src/modules/evaluators/services/evaluator.services';
import { FeedService } from 'src/modules/feed/services/feed.service';
import { CreateReminderPayload } from 'src/modules/reminders/dtos/create-reminder-payload';
import { ReminderService } from 'src/modules/reminders/services/reminder.service';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { DataSource, Repository } from 'typeorm';
import { formatCategory } from '../formatters/categories.formatter';
import { formatDocumentRevision } from '../formatters/document-revisions.formatter';
import { formatDepartament } from '../formatters/departaments.formatters';
import { formatDocument } from '../formatters/documents.formatters';
import { RolesService } from 'src/modules/roles/services/roles.services';
import { formatRole } from '../formatters/roles.formatter';

@Injectable()
export class DocumentsImportService {
  constructor(
    @InjectDataSource('externalConnection')
    private connection: DataSource,
    private readonly documentsServices: DocumentsService,
    private readonly departmentsServices: DepartamentService,
    private readonly categoriesServices: CategoriesService,
    private readonly documentRevisionService: DocumentRevisionService,
    private readonly s3Service: S3Service,
    private readonly feedService: FeedService,
    private readonly departamentsPermissionsService: DepartamentPermissionsService,
    private readonly evaluatorsService: EvaluatorService,
    private readonly documentRelatedsService: DocumentRelatedsService,
    private readonly reminderService: ReminderService,
    private readonly rolesServices: RolesService,

    @InjectRepository(Departament)
    private readonly departamentRepository: Repository<Departament>,
  ) {}

  async getDocuments(companyId: string): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    const documents = await queryRunner.query(
      // `SELECT * FROM documentos WHERE id=9440  `,
      `SELECT * FROM documentos WHERE empresa=${companyId}  `,
    );
    const departamentPromise = this.createCompanyDepartments(companyId);
    const categoryPromise = this.createCategories(companyId);
    const rolePromise = this.createRoles(companyId);

    await Promise.all([departamentPromise, categoryPromise, rolePromise]);

    const errors = [];
    const documentsFormatted = documents.map(async (document: any) => {
      try {
        const documentFormatted = formatDocument(document);
        const departmentExists = await this.departamentRepository.findOne({
          where: { id: documentFormatted.departamentId },
        });
        if (!departmentExists) {
          delete documentFormatted.departamentId;
        }
        await this.documentsServices.createDocument(documentFormatted, true);

        const uploads = this.creatingDocumentsUploads(document.id, companyId);
        const reminders = this.getReminders(document.id);
        const revisions = this.createRevisions(document.id);
        const departament = this.getAllowedDepartaments(document.id);
        const feed = this.getDocumentFeed(document.id);
        const evaluators = this.getEvaluators(document.id);

        await Promise.all([
          departament,
          feed,
          evaluators,
          revisions,
          uploads,
          reminders,
        ]);
        return documentFormatted;
      } catch (e) {
        errors.push({ error: e, documentId: document.id });
        console.log('Documento:', document.id);
        console.log('Erros', e);
        console.log('---------------------------');
      }
    });
    const documentsCreated = await Promise.all(documentsFormatted);

    const relatedDocumentPromise = documentsCreated.map(async (doc) => {
      await this.getRelatedDocuments(doc.id, doc.companyId);
    });
    console.log('Erros: ', errors);
    await Promise.all(relatedDocumentPromise);
    await queryRunner.release();
    return documentsCreated;
  }

  async createCompanyDepartments(companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const departaments = await queryRunner.query(
        'SELECT * FROM selects WHERE empresa = ? AND chave = ? AND modulo = ?',
        [companyId, 'departamentos', 'empresas'],
      );

      const departamentsFormatted = departaments.map((departament: any) => {
        const departamentFormatted = formatDepartament(departament);
        return departamentFormatted;
      });

      const departamentPromise = departamentsFormatted.map(
        async (departament: any) => {
          await this.departmentsServices.createCategory(departament);
        },
      );

      return Promise.all(departamentPromise);
    } catch (error) {
      console.error('Error executing query on createDepartamexxnts', error);
    }
  }

  async createRoles(companyId: string) {
    try {
      const queryRunner = this.connection.createQueryRunner();

      const roles = await queryRunner.query(
        'SELECT * FROM selects WHERE empresa = ? AND chave = ? AND modulo = ?',
        [companyId, 'funcoes', 'empresas'],
      );

      const rolePromise = roles.map(async (role: any) => {
        const roleFormatted = formatRole(role);
        await this.rolesServices.createCategory(roleFormatted);
      });

      return Promise.all(rolePromise);
    } catch (e) {
      console.error('Error creating roles', e);
    }
  }

  async createCategories(companyId: string) {
    try {
      const queryRunner = this.connection.createQueryRunner();

      const categories = await queryRunner.query(
        'SELECT * FROM selects WHERE empresa = ? AND chave = ? AND modulo = ?',
        [companyId, 'categorias', 'documentos'],
      );

      const categoryPromise = categories.map(async (category: any) => {
        const categoryFormatted = formatCategory(category);
        await this.categoriesServices.createCategory(categoryFormatted);
      });

      return Promise.all(categoryPromise);
    } catch (e) {
      console.error('Error creating categories', e);
    }
  }
  // async createProjects(companyId: string, projects: any[]) {} // TODO FAZER MIGRAÇÃO DOS PROJETOS

  async creatingDocumentsUploads(moduleKey: string, companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const uploads = await queryRunner.query(
        `
        SELECT *
        FROM uploads
        WHERE modulo = 'documentos'
          AND data_upload > '2024-04-24'
          AND modulo_key = ?
      `,
        [moduleKey],
      );

      const uploadPromise = uploads.map(async (upload: any) => {
        try {
          await this.s3Service.transferObject(
            upload.link,
            `${companyId}/documents`,
            upload.nome,
            companyId,
            process.env.MODULE_DOCUMENTS_ID,
            upload['modulo_key'],
          );
        } catch (e) {
          console.log('Erro', e);
        }
      });

      await Promise.all(uploadPromise);
    } catch (error) {
      console.error('Erro ao processar uploads:', error);
    } finally {
      await queryRunner.release();
    }
  }

  async createRevisions(documentId: string) {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();

      const revisions = await queryRunner.query(
        `
        SELECT documentos_revisoes.*, usuarios.nome
        FROM documentos_revisoes
        INNER JOIN usuarios ON usuarios.id = documentos_revisoes.usuario_id
        WHERE documento_id = ?
      `,
        [documentId],
      );

      const revisionsPromise = revisions.map(async (revision: any) => {
        const revisionFormatted = formatDocumentRevision(revision);
        await this.documentRevisionService.createRevision(revisionFormatted);
        return revisionFormatted;
      });

      return Promise.all(revisionsPromise);
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getDocumentFeed(documentId: string) {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();

      const feed = await queryRunner.query(
        `
            SELECT * 
            FROM documentos_feed 
            WHERE documentos_fk = ? 
            ORDER BY id DESC
            `,
        [documentId],
      );

      const feedPromise = feed.map(async (feedItem: any) => {
        const feedFormatted = {
          text: feedItem.texto,
          externalId: feedItem.documentos_fk,
          user: feedItem.usuario_fk as string,
          moduleId: process.env.MODULE_DOCUMENTS_ID,
          userId: feedItem.usuario_fk as string,
          companyId: feedItem.company_fk as string,
        };
        await this.feedService.createFeed(feedFormatted);
      });
      return Promise.all(feedPromise);
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllowedDepartaments(documentId: string) {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();

      const result = await queryRunner.query(
        `
            SELECT a.*, b.nome as nome_departamento
            FROM documentos_departamentos_permissoes a
            INNER JOIN selects b ON a.departamento = b.id
            WHERE a.documento = ?
            `,
        [documentId],
      );

      const departamentPromise = result.map(async (departament: any) => {
        const departamentFormatted = {
          documentId: departament.documento,
          isAuthorized: departament.autorizado == 1,
          departaments: [departament.departamento],
        };
        await this.departamentsPermissionsService.createDepartamentPermission(
          departamentFormatted,
        );
      });
      return Promise.all(departamentPromise);
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getEvaluators(documentId: string) {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();

      const result = await queryRunner.query(
        `
            SELECT documentos_aprovacoes.*, usuarios.nome as nome_usuario
            FROM documentos_aprovacoes
            INNER JOIN usuarios ON usuarios.id = documentos_aprovacoes.usuario
            WHERE documentos_aprovacoes.documento = ?
            `,
        [documentId],
      );

      const evaluatorsPromise = result.map(async (evaluator: any) => {
        const evaluatorFormatted = {
          documentId: evaluator.documento,
          userId: evaluator.usuario,
          approved: evaluator.aprovado,
          reviewed: evaluator.revisado,
          cancelled: evaluator.cancelado,
          deleted: evaluator.deletado,
          edited: evaluator.editado,
          cancelDescription: evaluator.cancelamento_descricao,
        };
        await this.evaluatorsService.createEvaluator(evaluatorFormatted);
      });
      return Promise.all(evaluatorsPromise);
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getRelatedDocuments(documentId: string, companyId: string) {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();

      const relatedDocuments = await queryRunner.query(
        `
            SELECT tbDepartamentos.nome AS departamento, tbCategorias.nome AS categoria,
                   docs.autor AS autor, docs.nome AS nomeDocumento, docs_relacionados.id,
                   docs_relacionados.doc_id
            FROM documentos_relacionados AS docs_relacionados
            INNER JOIN documentos docs ON docs.id = docs_relacionados.doc_id
            LEFT JOIN selects tbCategorias ON tbCategorias.id = docs.categoria
            LEFT JOIN selects tbDepartamentos ON tbDepartamentos.id = docs.departamento
            WHERE docs_relacionados.doc_principal_id = ?
            `,
        [documentId],
      );
      const promise = relatedDocuments.map(async (relatedDocument: any) => {
        const relatedDocumentFormatted = {
          mainDocId: documentId,
          relatedDocId: relatedDocument.doc_id,
          companyId: companyId,
        };
        await this.documentRelatedsService.create(relatedDocumentFormatted);
      });
      await Promise.all(promise);
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getReminders(documentId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const reminders = await queryRunner.query(
        `
        SELECT *
        FROM lembretes
        WHERE modulo = 'documentos' AND chave = ?
      `,
        [documentId],
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
        await this.reminderService.createReminder(reminderFormatted);
      });
      Promise.all(reminderPromise);
    } catch (error) {
      console.error('Erro ao obter lembretes:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
