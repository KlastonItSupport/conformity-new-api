import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class EquipmentsAction1723643278922 implements MigrationInterface {
  private readonly TABLE_NAME = 'equipments_actions';

  //   type - varchar not null
  // equipment_fk - int,
  // validity - optional, varchar nullable
  // next_date - date, nullable
  // date - date, nullable

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'equipments_action_equipment_fk',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'validity',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'next_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'equipments_action_equipment_fk',
            referencedTableName: 'equipments',
            referencedColumnNames: ['id'],
            columnNames: ['equipments_action_equipment_fk'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
