import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// id - incremented
// indicators_company_fk - fk
// department_fk - fk
// collect_day - int - nullable
// responsable - varchar
// goal - text
// resulting - text
// frequency - varchar
// facts - varhcar
// meta - varchar
// how_to_measure - text
// deadline - date
// direction - varchar

export class Indicators1725452937619 implements MigrationInterface {
  private TABLE_NAME = 'indicators';
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
            name: 'indicators_company_fk',
            type: 'varchar',
          },
          {
            name: 'indicators_department_fk',
            type: 'varchar',
          },
          {
            name: 'collect_day',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'responsable',
            type: 'varchar',
          },
          {
            name: 'goal',
            type: 'text',
          },

          {
            name: 'frequency',
            type: 'varchar',
          },
          {
            name: 'data_type',
            type: 'varchar',
          },
          {
            name: 'meta',
            type: 'varchar',
          },
          {
            name: 'how_to_measure',
            type: 'text',
          },
          {
            name: 'what_to_measure',
            type: 'text',
          },
          {
            name: 'deadline',
            type: 'date',
          },
          {
            name: 'direction',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'indicators_company_fk',
            columnNames: ['indicators_company_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'companies',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'indicators_department_fk',
            columnNames: ['indicators_department_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'departaments',
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
