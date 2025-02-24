import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ServicesTable1727184505476 implements MigrationInterface {
  private readonly TABLE_NAME = 'services';

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
            name: 'services_company_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'service',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'services_company_fk',
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            columnNames: ['services_company_fk'],
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
