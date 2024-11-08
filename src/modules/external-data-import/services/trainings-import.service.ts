import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { SchoolsService } from 'src/modules/schools/services/schools.service';
import { DataSource } from 'typeorm';
import { formatSchool } from '../formatters/schools.formatter';
import { formatTraining } from '../formatters/training.format';
import { TrainingService } from 'src/modules/trainings/services/training.service';
import { formatUsersTrainings } from '../formatters/users-training.formatter';
import { UserTrainingsService } from 'src/modules/user-trainings/services/user-trainings.service';
import { S3Service } from 'src/modules/shared/services/s3.service';

@Injectable()
export class TrainingsImportService {
  constructor(
    private readonly schoolsService: SchoolsService,
    private readonly trainingService: TrainingService,
    private readonly userTrainingsService: UserTrainingsService,
    private readonly s3Service: S3Service,

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

    const trainingCreate = trainingsFormatted.map(async (training) => {
      try {
        const trainings = await this.trainingService.create(training);
        const usersTrainings = await this.getUsersTrainings(training.id);
        return { usersTrainings, ...trainings };
      } catch (error) {
        errors.push({ message: error.message, training: training });
      }
    });
    return { trainings: await Promise.all(trainingCreate), errors };
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

  async getCertificates(companyId: number) {
    const query = `
    SELECT * 
    FROM uploads 
    WHERE modulo = 'treinamentos'   
    AND empresa = ?
  `;

    const documents = await this.connection.query(query, [companyId]);

    const certificatePromise = documents.map(async (document) => {
      const upload = await this.s3Service.transferObject(
        document.link.replace(
          'https://app.conformity.me/uploads/',
          'http://localhost:5000/uploads/',
        ),
        `${companyId}/trainings`,
        document.nome,
        companyId.toString(),
        process.env.MODULE_TRAINING_ID,
        document['modulo_key'],
      );

      return {
        upload,
        id: document.id,
      };
    });
    const certificates = await Promise.all(certificatePromise);
    return { total: certificates.length, certificates };
  }

  async getTrainingsModule(companyId: number) {
    const schools = await this.getSchools(companyId);
    const trainings = await this.getTrainings(companyId);
    const certificates = await this.getCertificates(companyId);
    return { schools, trainings, certificates };
  }
}
