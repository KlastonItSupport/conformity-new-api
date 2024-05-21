import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppError } from 'src/errors/app-error';
import { CompanyService } from 'src/modules/companies/services/company.service';
import { UsersServices } from 'src/modules/users/services/users.services';
import { DataSource } from 'typeorm';
import { formatCompany } from '../formatters/companies.formatters';
import { formatUser } from '../formatters/users.formatters';

@Injectable()
export class ExternalDataImportService {
  constructor(
    @InjectDataSource('externalConnection')
    private connection: DataSource,

    private readonly usersServices: UsersServices,
    private readonly companiesServices: CompanyService,
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
          if (user?.acesso == false || user?.status == 'cancelado') {
            return null;
          }

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
        }
      }),
    );

    await queryRunner.release();
    return { company, users };
  }
}
