import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AppError } from 'src/errors/app-error';
import { CompanyService } from 'src/modules/companies/services/company.service';
import { UsersServices } from 'src/modules/users/services/users.services';
import { DataSource, Repository } from 'typeorm';
import { formatCompany } from '../formatters/companies.formatters';
import { formatUser } from '../formatters/users.formatters';
import { DocumentsService } from 'src/modules/documents/services/documents.service';
import { DepartamentService } from 'src/modules/departaments/services/departament.services';
import { CategoriesService } from 'src/modules/categories/services/categories.services';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { DocumentRevisionService } from 'src/modules/document-revisions/services/document-revision.services';
import { FeedService } from 'src/modules/feed/services/feed.service';
import { DepartamentPermissionsService } from 'src/modules/departaments-permissions/services/departament-permissions.services';
import { EvaluatorService } from 'src/modules/evaluators/services/evaluator.services';
import { Departament } from 'src/modules/departaments/entities/departament.entity';
import { DocumentRelatedsService } from 'src/modules/document-relateds/services/document-relateds.services';
import { ReminderService } from 'src/modules/reminders/services/reminder.service';
import { WarningsService } from 'src/modules/warnings/services/warnings.service';

@Injectable()
export class ExternalDataImportService {
  constructor(
    @InjectDataSource('externalConnection')
    private connection: DataSource,

    private readonly usersServices: UsersServices,
    private readonly companiesServices: CompanyService,
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
    private readonly warningsService: WarningsService,

    @InjectRepository(Departament)
    private readonly departamentRepository: Repository<Departament>,
  ) {}

  async importData(
    companyId: string,
    data: { email: string; userId: string; defaultPassword: string },
  ): Promise<any> {
    const accessRule = await this.usersServices.getUserAccessRule(data.userId);

    if (!accessRule.isAdmin && !accessRule.isSuperUser) {
      throw new AppError('Not Authorized', 401);
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const companies = await queryRunner.query(
      `SELECT * FROM empresas WHERE id=${companyId}`,
    );

    if (!companies || companies.length === 0) {
      throw new AppError('Company not found', 404);
    }

    const mainUserOld = await queryRunner.query(
      `SELECT * FROM usuarios WHERE empresa=${companyId} AND email ='${data.email}'`,
    );

    if (!mainUserOld || mainUserOld.length === 0) {
      throw new AppError('User not found in this company', 404);
    }

    const companyFormatted = formatCompany(companies[0]);
    companyFormatted['id'] = companyId;
    const company = await this.companiesServices.createCompany(
      companyFormatted,
      data.userId,
    );

    const userFormatted = formatUser(mainUserOld[0]);

    await this.usersServices.createUser(
      {
        ...userFormatted,
        companyId: company.id,
        password: data.defaultPassword,
      },
      data.userId,
    );

    const usersOld: [] = await queryRunner.query(
      `SELECT * FROM usuarios WHERE empresa=${companyId}`,
    );

    const users = await Promise.all(
      usersOld.map(async (user: any) => {
        try {
          const userFormatted = formatUser(user);
          // if (user?.acesso == false || user?.status == 'cancelado') {
          //   return null;
          // }

          const mainUserNew = await this.usersServices.createUser(
            {
              ...userFormatted,
              companyId: company.id,
              password: data.defaultPassword,
            },
            data.userId,
          );

          return mainUserNew;
        } catch (e) {
          console.log('ERRO', e);
          console.log('Id:', user.id);
        }
      }),
    );
    const warning = await this.getCompanyWarnings(companyId);
    await queryRunner.release();
    return { warning, company, users };
  }

  async getCompanyWarnings(companyId: string) {
    const query = `SELECT * FROM avisos WHERE empresa = ?`;
    const warning = await this.connection.query(query, [companyId]);
    const warningFormatted = {
      id: warning[0].id,
      showWarning: warning[0].ativo,
      companyId: companyId,
      warningMessage: warning[0].aviso,
    };

    const warningCreated = await this.warningsService.createWarning(
      warningFormatted,
      true,
    );
    return { created: warningCreated, old: warning };
  }
}
