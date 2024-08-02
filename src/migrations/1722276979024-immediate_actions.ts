import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ImmediateActions1722276979024 implements MigrationInterface {
  private readonly tableName = 'tasks_immediate_actions';

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
            name: 'tasks_immediate_actions_user_fk',
            type: 'varchar',
          },
          {
            name: 'tasks_immediate_actions_task_fk',
            type: 'int',
          },
          {
            name: 'action',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'responsable',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'tasks_immediate_actions_user_fk',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['tasks_immediate_actions_user_fk'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'tasks_immediate_actions_task_fk',
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            columnNames: ['tasks_immediate_actions_task_fk'],
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
