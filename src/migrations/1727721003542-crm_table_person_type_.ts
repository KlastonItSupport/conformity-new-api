import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CrmTablePersonType_1727721003542 implements MigrationInterface {
  private readonly TABLE_NAME = 'crm_companies';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE_NAME,
      new TableColumn({
        name: 'person_type',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.TABLE_NAME, 'person_type');
  }
}
