import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CrmNullable1729088756028 implements MigrationInterface {
  private readonly TABLE_NAME = 'leads';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'leads_crm_companies_fk',
      new TableColumn({
        name: 'leads_crm_companies_fk',
        type: 'int',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'leads_crm_companies_fk',
      new TableColumn({
        name: 'leads_crm_companies_fk',
        type: 'int',
        isNullable: false,
      }),
    );
  }
}
