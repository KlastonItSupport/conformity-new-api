import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateTasksTable1722868577807 implements MigrationInterface {
  private readonly TABLE_NAME = 'tasks';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'responsable',
      new TableColumn({
        name: 'responsable',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'date_prevision',
      new TableColumn({
        name: 'date_prevision',
        type: 'date',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'responsable',
      new TableColumn({
        name: 'responsable',
        type: 'varchar',
        isNullable: false,
      }),
    );
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'date_prevision',
      new TableColumn({
        name: 'date_prevision',
        type: 'date',
        isNullable: false,
      }),
    );
  }
}
