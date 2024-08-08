import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AllowingBigTextToTextCr1723039856927
  implements MigrationInterface
{
  private readonly TABLE_NAME = 'task_root_cause';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'root_cause_user_fk',
      new TableColumn({
        name: 'root_cause_user_fk',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'root_cause',
      new TableColumn({
        name: 'root_cause',
        type: 'mediumtext',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'root_cause_user_fk',
      new TableColumn({
        name: 'root_cause_user_fk',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'root_cause',
      new TableColumn({
        name: 'root_cause',
        type: 'text',
        isNullable: false,
      }),
    );
  }
}
