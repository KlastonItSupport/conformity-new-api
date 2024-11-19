import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class WarningsTable1731505998374 implements MigrationInterface {
  private readonly TABLE_NAME = 'warnings';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'show_warning',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'expired_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'fk_warnings_company',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'warning_message',
            type: 'longtext',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'fk_warnings_company',
            referencedTableName: 'companies',
            columnNames: ['fk_warnings_company'],
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
