import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { SchoolsService } from 'src/modules/schools/services/schools.service';
import { DataSource } from 'typeorm';
import { formatSchool } from '../formatters/schools.formatter';
import { formatTraining } from '../formatters/training.format';
import { TrainingService } from 'src/modules/trainings/services/training.service';
import { formatUsersTrainings } from '../formatters/users-training.formatter';
import { UserTrainingsService } from 'src/modules/user-trainings/services/user-trainings.service';

@Injectable()
export class TrainingsImportService {
  constructor(
    private readonly schoolsService: SchoolsService,
    private readonly trainingService: TrainingService,
    private readonly userTrainingsService: UserTrainingsService,

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
        const usersTrainings = await this.getUsersTrainings(schoolCreated.id);
        return { usersTrainings, ...schoolCreated };
      } catch (error) {
        errors.push({ message: error.message, training: training });
      }
    });
    return { trainings: await Promise.all(trainingCreateSchool), errors };
  }

  async getUsersTrainings(trainingId: number) {
    const query = ` SELECT * FROM usuarios_treinamentos WHERE treinamento = ?`;
    const usersTrainings = await this.connection.query(query, [trainingId]);
    const errors = [];

    const usersTrainingsFormatted = usersTrainings.map((userTraining) =>
      formatUsersTrainings(userTraining),
    );

    const promiseCreateUsersTrainings = usersTrainingsFormatted.map(
      async (userTraining) => {
        try {
          const userTrainingCreated =
            await this.userTrainingsService.create(userTraining);
          return userTrainingCreated;
        } catch (error) {
          if (
            !error.sqlMessage.includes(
              'REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE)',
            )
          ) {
            errors.push({
              message: error.message,
              userTraining: userTraining,
            });
          }
        }
      },
    );
    const usersTrainingCreated = await Promise.all(promiseCreateUsersTrainings);
    return {
      errors,
      totalToImport: usersTrainings.length,
      imported: usersTrainingCreated.length - errors.length,
      usersTrainings: usersTrainingCreated,
    };
  }

  async getTrainingsModule(companyId: number) {
    return await this.getTrainings(companyId);
  }
}
