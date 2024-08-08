import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TasksRelateds1722343999257 implements MigrationInterface {
  private readonly tableName = 'tasks_subtasks';
  //   id - int auto generated
  // task_fk
  // title - varchar
  // description - varchar
  // initial_date - date
  // end_date - date

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
            name: 'tasks_subtask_task_fk',
            type: 'int',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
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
            name: 'completed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'order',
            type: 'int',
            default: 0,
          },
        ],
        foreignKeys: [
          {
            name: 'tasks_subtask_task_fk',
            columnNames: ['tasks_subtask_task_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
