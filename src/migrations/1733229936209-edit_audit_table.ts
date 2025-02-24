import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class EditAuditTable1733229936209 implements MigrationInterface {
  private readonly TABLE_NAME = 'audit';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE_NAME,
      new TableColumn({
        name: 'module',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.TABLE_NAME, 'module');
  }
}
