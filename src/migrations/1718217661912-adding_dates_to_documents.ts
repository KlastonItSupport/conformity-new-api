import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddingDatesToDocuments1718217661912 implements MigrationInterface {
  private readonly table = 'documents';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(this.table, [
      new TableColumn({
        name: 'system_inclusion_date',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'system_created_date',
        type: 'date',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.table, 'system_inclusion_date');
    await queryRunner.dropColumn(this.table, 'system_created_date');
  }
}
