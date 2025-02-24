import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TasksChecklist1722606037750 implements MigrationInterface {
  //     id - int auto generated
  // name - varchar
  // is_completed  - boolean
  private readonly tableName = 'tasks_checklist';

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
            name: 'checklist_subtask_fk',
            type: 'int',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'is_completed',
            type: 'boolean',
            default: false,
          },
        ],
        foreignKeys: [
          {
            name: 'checklist_subtask_fk',
            columnNames: ['checklist_subtask_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks_subtasks',
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
