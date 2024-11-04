import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { SchoolsService } from 'src/modules/schools/services/schools.service';
import { DataSource } from 'typeorm';
import { formatSchool } from '../formatters/schools.formatter';
import { formatTraining } from '../formatters/training.format';
import { TrainingService } from 'src/modules/trainings/services/training.service';

@Injectable()
export class TrainingsImportService {
  constructor(
    private readonly schoolsService: SchoolsService,
    private readonly trainingService: TrainingService,

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

  async getTrainings(companyId: number) {
    const query = `
      SELECT a.*, b.nome AS nome_empresa, c.nome AS nome_escola
      FROM treinamentos a
      JOIN empresas b ON a.empresa = b.id
      JOIN escolas c ON a.escola = c.id
      WHERE a.empresa = ?
    `;

    const errors = [];
    const trainings = await this.connection.query(query, [companyId]);
    const trainingsFormatted = trainings.map((training) =>
      formatTraining(training),
    );

    const trainingCreateSchool = trainingsFormatted.map(async (training) => {
      try {
        const schoolCreated = await this.trainingService.create(training);
        return schoolCreated;
      } catch (error) {
        errors.push({ message: error.message, training: training });
      }
    });
    return { trainings: await Promise.all(trainingCreateSchool), errors };
  }

  async getTrainingsModule(companyId: number) {
    return await this.getTrainings(companyId);
  }
}
