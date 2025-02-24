import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ContractTable1727206165435 implements MigrationInterface {
  // id - auto generated - not nullable
  // company_fk - varhcar
  // client_fk - varchar
  // title - varchar
  // initial_date - date
  // end_date - date
  // value - varchar
  // link - varchar
  // details - varchar
  // status - varchar - not nullable

  private readonly TABLE_NAME = 'contracts';
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
            name: 'contracts_company_fk',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'crm_companies_fk',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'initial_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'value',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'link',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'details',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'contracts_company_fk',
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            columnNames: ['contracts_company_fk'],
            onDelete: 'SET NULL',
          },
          {
            name: 'crm_companies_fk',
            referencedTableName: 'crm_companies',
            referencedColumnNames: ['id'],
            columnNames: ['crm_companies_fk'],
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
