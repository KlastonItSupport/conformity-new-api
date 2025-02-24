import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class IndicatorTask1725461224604 implements MigrationInterface {
  private readonly TABLE_NAME = 'indicator_tasks';

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
            name: 'indicator_tasks_fk',
            type: 'int',
          },
          {
            name: 'indicator_tasks_indicator_fk',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            name: 'indicator_tasks_fk',
            columnNames: ['indicator_tasks_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'indicator_tasks_indicator_fk',
            columnNames: ['indicator_tasks_indicator_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'indicator_answers',
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
