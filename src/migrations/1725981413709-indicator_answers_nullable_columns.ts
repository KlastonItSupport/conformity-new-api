import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class IndicatorAnswersNullableColumns1725981413709
  implements MigrationInterface
{
  private readonly TABLE_NAME = 'indicator_answers';
  private readonly COLUMN_NAME = 'reason';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      this.COLUMN_NAME,
      new TableColumn({
        name: this.COLUMN_NAME,
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      this.COLUMN_NAME,
      new TableColumn({
        name: this.COLUMN_NAME,
        type: 'text',
        isNullable: false,
      }),
    );
  }
}
