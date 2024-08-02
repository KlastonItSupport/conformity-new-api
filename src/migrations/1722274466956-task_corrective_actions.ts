import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TaskCorrectiveActions1722274466956 implements MigrationInterface {
  private readonly tableName = 'task_corrective_actions';
  //   id - int
  // user_fk - varchar
  // task_fk - int
  // date - date
  // result - varchar
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
            name: 'corrective_actions_user_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'corrective_actions_task_fk',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'result',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'action',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'responsable',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'corrective_actions_task_fk',
            columnNames: ['corrective_actions_task_fk'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'corrective_actions_user_fk',
            columnNames: ['corrective_actions_user_fk'],
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
