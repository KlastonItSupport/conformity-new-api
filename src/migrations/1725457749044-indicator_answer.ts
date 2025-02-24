import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class IndicatorAnswer1725457749044 implements MigrationInterface {
  private readonly TABLE_NAME = 'indicator_answers';
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
            name: 'indicator_answers_company_fk',
            type: 'varchar',
          },
          {
            name: 'indicator_fk',
            type: 'int',
          },
          {
            name: 'goal',
            type: 'text',
          },
          {
            name: 'answer',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'reason',
            type: 'text',
          },
        ],
        foreignKeys: [
          {
            name: 'indicator_answers_company_fk',
            columnNames: ['indicator_answers_company_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'companies',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'indicator_fk',
            columnNames: ['indicator_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'indicators',
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
