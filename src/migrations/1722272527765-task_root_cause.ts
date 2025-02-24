import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TaskRootCause1722272527765 implements MigrationInterface {
  private readonly tableName = 'task_root_cause';

  //   id - int
  // user_fk - varchar
  // task_fk - int
  // root_cause - varchar

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
            name: 'root_cause_user_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'root_cause_task_fk',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'root_cause',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'root_cause_task_fk',
            columnNames: ['root_cause_task_fk'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'root_cause_user_fk',
            columnNames: ['root_cause_user_fk'],
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
