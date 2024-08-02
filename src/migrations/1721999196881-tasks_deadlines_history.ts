import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// id - int
// created_at - timestamp
// userId - int
// taskId - int
// old_date - datetime
// new_date - datetime
// description - varchar
export class TasksDeadlinesHistory1721999196881 implements MigrationInterface {
  private readonly TABLE_NAME = 'tasks_deadlines_history';
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
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'task_deadline_history_user_fk',
            type: 'varchar',
          },
          {
            name: 'task_deadline_history_task_fk',
            type: 'int',
          },
          {
            name: 'old_date',
            type: 'datetime',
          },
          {
            name: 'new_date',
            type: 'datetime',
          },
          {
            name: 'description',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'task_deadline_history_task_fk',
            columnNames: ['task_deadline_history_task_fk'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'task_deadline_history_user_fk',
            columnNames: ['task_deadline_history_user_fk'],
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
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
