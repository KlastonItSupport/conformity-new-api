import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterCrmTableAddState1727967100817 implements MigrationInterface {
  private readonly TABLE_NAME = 'crm_companies';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE_NAME,
      new TableColumn({
        name: 'state',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.TABLE_NAME, 'state');
  }
}
