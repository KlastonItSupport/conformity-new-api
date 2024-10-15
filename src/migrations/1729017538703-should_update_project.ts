import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ShouldUpdateProject1729017538703 implements MigrationInterface {
  private readonly TABLE_NAME = 'projects';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE_NAME,
      new TableColumn({
        name: 'update_progress_automatically',
        default: true,
        type: 'boolean',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      this.TABLE_NAME,
      'update_progress_automatically',
    );
  }
}
