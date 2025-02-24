import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AllowingUseridNullableImmediateAction1723042532929
  implements MigrationInterface
{
  private readonly tableName = 'tasks_immediate_actions';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.tableName,
      'tasks_immediate_actions_user_fk',
      new TableColumn({
        name: 'tasks_immediate_actions_user_fk',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.tableName,
      'tasks_immediate_actions_user_fk',
      new TableColumn({
        name: 'tasks_immediate_actions_user_fk',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
