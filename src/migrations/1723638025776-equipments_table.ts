import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class EquipmentsTable1723638025776 implements MigrationInterface {
  private readonly TABLE_NAME = 'equipments';

  //   id - int autoincrement
  // company_fk
  // name
  // description
  // model
  // series
  // manufacturer
  // certified
  // range
  // tolerancy
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
            name: 'equipments_company_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'model',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'series',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'manufacturer',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'certified',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'range',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tolerancy',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'equipments_company_fk',
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            columnNames: ['equipments_company_fk'],
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
