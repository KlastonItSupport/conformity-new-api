import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TaskIsh1722279164330 implements MigrationInterface {
  private readonly tableName = 'task_ish';
  //   id - int
  // user_fk - varchar
  // task_fk - int
  // method - varchar
  // machine - varchar
  // material - varchar
  // work_hand - varchar
  // measure - varchar
  // environment - varchar

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
            name: 'ish_user_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'ish_task_fk',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'method',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'machine',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'material',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'work_hand',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'measure',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'environment',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'ish_task_fk',
            columnNames: ['ish_task_fk'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ish_user_fk',
            columnNames: ['ish_user_fk'],
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
