import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { EquipmentsService } from 'src/modules/equipments/services/equipments.service';
import { DataSource } from 'typeorm';
import { formatEquipment } from '../formatters/equipments.formatter';
import { CreateEquipmentDto } from 'src/modules/equipments/dtos/create-equipment-payload';
import { ActionsService } from 'src/modules/equipments/services/actions.service';
import { formatAction } from '../formatters/action.formatter';
import { CreateEquipmentActionDto } from 'src/modules/equipments/dtos/create-action-payload';
import { S3Service } from 'src/modules/shared/services/s3.service';

@Injectable()
export class EquipmentImportService {
  constructor(
    @InjectDataSource('externalConnection')
    private connection: DataSource,

    private readonly equipmentsServices: EquipmentsService,
    private readonly actionsServices: ActionsService,
    private readonly s3Service: S3Service,
  ) {}

  async getDocuments(companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const equipment = await this.equipmentsServices.create({
      name: 'Documentos anexados no conformity antigo',
      description: '',
      model: '',
      series: '',
      manufacturer: '',
      certified: '',
      range: '',
      tolerancy: '',
      companyId,
    });

    const action = await this.actionsServices.create(
      {
        type: 'ANEXOS ESTÃO AQUI',
        equipmentId: equipment.id.toString(),
        validity: '1 ano',
        nextDate: new Date(),
        date: new Date(),
      },
      companyId,
    );
    const uploads = await queryRunner.query(
      `SELECT * FROM uploads WHERE modulo='equipamentos'  AND empresa = ? AND data_upload > '2024-04-24'`,
      [companyId],
    );

    const promiseUploads = uploads.map(async (upload) => {
      console.log('data:', upload['data_upload']);
      return await this.s3Service.transferObject(
        upload.link,
        `${companyId}/equipments`,
        upload.nome,
        companyId,
        process.env.MODULE_EQUIPMENTS_ID,
        action.id.toString(),
      );
    });

    await Promise.all(promiseUploads);
    queryRunner.release();
    return;
  }

  async getActions(equipmentId: string, companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const actions = await queryRunner.query(
      `SELECT * FROM acoes WHERE equipamento=?`,
      [equipmentId],
    );

    const actionPromise = actions.map(async (action) => {
      const actionFormatted = formatAction(action);

      try {
        const actionCreated = await this.actionsServices.create(
          actionFormatted as unknown as CreateEquipmentActionDto,
          companyId,
        );

        return actionCreated;
      } catch (e) {
        console.log('ERRO ACTION', e);
      }
    });

    const actionsResult = await Promise.all(actionPromise);
    queryRunner.release();
    return actionsResult;
  }
  async getAllEquipments(companyId: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const equipments = await queryRunner.query(
      `SELECT * FROM equipamentos WHERE empresa=?`,
      [companyId],
    );

    const equipmentPromise = equipments.map(async (equipment: any, index) => {
      const equipmentFormatted = formatEquipment(equipment);

      try {
        const isLast = index === equipments.length - 1;
        const equipmentCreated = await this.equipmentsServices.create(
          equipmentFormatted as unknown as CreateEquipmentDto,
        );

        const actions = await this.getActions(equipment['id'], companyId);

        if (isLast) {
          await this.getDocuments(companyId);
        }
        return { ...equipmentCreated, actions };
      } catch (e) {
        console.log('ERRO', e);
      }
    });

    return await Promise.all(equipmentPromise);
  }
}
