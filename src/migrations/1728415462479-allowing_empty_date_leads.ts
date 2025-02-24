import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AllowingEmptyDateLeads1728415462479 implements MigrationInterface {
  private readonly TABLE_NAME = 'leads';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'date',
      new TableColumn({
        name: 'date',
        type: 'date',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'solicitation_month',
      new TableColumn({
        name: 'solicitation_month',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'updated_at',
      new TableColumn({
        name: 'updated_at',
        type: 'datetime',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'date',
      new TableColumn({
        name: 'date',
        type: 'date',
        isNullable: false,
      }),
    );
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'solicitation_month',
      new TableColumn({
        name: 'solicitation_month',
        type: 'int',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      this.TABLE_NAME,
      'updated_at',
      new TableColumn({
        name: 'updated_at',
        type: 'date',
        isNullable: true,
      }),
    );
  }
}
