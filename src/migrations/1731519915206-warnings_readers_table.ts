import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class WarningsReadersTable1731519915206 implements MigrationInterface {
  private readonly TABLE_NAME = 'warnings_readers';

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
            name: 'readers_user_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'readers_warning_fk',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],

        foreignKeys: [
          {
            name: 'readers_user_fk',
            referencedTableName: 'users',
            columnNames: ['readers_user_fk'],
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            name: 'readers_warning_fk',
            referencedTableName: 'warnings',
            columnNames: ['readers_warning_fk'],
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
