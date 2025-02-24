import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TaskRootCauseAnalysis1722262762516 implements MigrationInterface {
  private readonly tableName = 'tasks_root_cause_analysis';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'root_cause_analysis_user_fk',
            type: 'varchar',
          },
          {
            name: 'root_cause_analysis_task_fk',
            type: 'int',
          },
          {
            name: 'why',
            type: 'varchar',
          },
          {
            name: 'answer',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'datetime',
          },
        ],
        foreignKeys: [
          {
            name: 'root_cause_analysis_task_fk',
            columnNames: ['root_cause_analysis_task_fk'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'root_cause_analysis_user_fk',
            columnNames: ['root_cause_analysis_user_fk'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
