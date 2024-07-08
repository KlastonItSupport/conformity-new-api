import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class RemindersTable1720006994461 implements MigrationInterface {
  private readonly TABLE_NAME = 'reminders';

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
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'module',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'key',
            type: 'varchar',
          },
          {
            name: 'frequency',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'hour',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'date_last_reminder',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'data_end',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'monday',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'tuesday',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'wednesday',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'thursday',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'friday',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'saturday',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'sunday',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'week_day',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'close_day',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'text',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
