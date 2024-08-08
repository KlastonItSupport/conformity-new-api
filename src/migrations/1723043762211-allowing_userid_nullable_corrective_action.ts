import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AllowingUseridNullableCorrectiveAction1723043762211
  implements MigrationInterface
{
  private readonly tableName = 'task_corrective_actions';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.tableName,
      'corrective_actions_user_fk',
      new TableColumn({
        name: 'corrective_actions_user_fk',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.tableName,
      'corrective_actions_user_fk',
      new TableColumn({
        name: 'corrective_actions_user_fk',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
