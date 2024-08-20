import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class EquipmentsDescriptionChange1724078366351
  implements MigrationInterface
{
  private readonly TABLE_NAME = 'equipments';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'description',
      new TableColumn({
        name: 'description',
        type: 'text',
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
        isNullable: true,
      }),
    );
  }
}
