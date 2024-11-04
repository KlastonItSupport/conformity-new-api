import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { SchoolsService } from 'src/modules/schools/services/schools.service';
import { DataSource } from 'typeorm';
import { formatSchool } from '../formatters/schools.formatter';

@Injectable()
export class TrainingsImportService {
  constructor(
    private readonly schoolsService: SchoolsService,

    @InjectDataSource('externalConnection')
    private connection: DataSource,
  ) {}

  async getSchools(companyId: number) {
    const query = `
      SELECT a.*, b.nome AS nome_empresa 
      FROM escolas a
      JOIN empresas b ON a.empresa = b.id
      WHERE a.empresa = ?
    `;

    const errors = [];
    const schools = await this.connection.query(query, [companyId]);
    const schoolsFormatted = schools.map((school) => formatSchool(school));

    const promiseCreateSchool = schoolsFormatted.map(async (school) => {
      try {
        const schoolCreated = await this.schoolsService.createSchools(school);
        return schoolCreated;
      } catch (error) {
        errors.push({ message: error.message, school: school });
      }
    });

    return { schools: await Promise.all(promiseCreateSchool), errors };
  }

  async getTrainingsModule(companyId: number) {
    return await this.getSchools(companyId);
  }
}
