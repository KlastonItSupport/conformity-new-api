import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateLeadsTable1727873941432 implements MigrationInterface {
  private readonly TABLE_NAME = 'leads';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'description',
      new TableColumn({
        name: 'description',
        type: 'longtext',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'description',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
