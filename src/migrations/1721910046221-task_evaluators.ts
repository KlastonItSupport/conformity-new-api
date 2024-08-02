import { MigrationInterface, QueryRunner, Table } from 'typeorm';
// id - int
// task_fk - int
// user_fk - int
// analyzed - int
// data - varchar
export class TaskEvaluators1721910046221 implements MigrationInterface {
  private readonly TABLE_NAME = 'task_evaluators';
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
            name: 'task_evaluator_task_fk',
            type: 'int',
          },
          {
            name: 'task_evaluator_user_fk',
            type: 'varchar',
          },
          {
            name: 'analyzed',
            type: 'int',
            default: 0,
          },
          {
            name: 'data',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'task_evaluator_task_fk',
            columnNames: ['task_evaluator_task_fk'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'task_evaluator_user_fk',
            columnNames: ['task_evaluator_user_fk'],
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
