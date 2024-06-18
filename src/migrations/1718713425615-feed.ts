import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Feed1718713425615 implements MigrationInterface {
  private readonly TABLE_NAME = 'feed';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'feed_user_id_fk',
            type: 'varchar',
          },
          {
            name: 'text',
            type: 'longtext',
          },
          {
            name: 'feed_module_id',
            type: 'varchar',
          },
          {
            name: 'external_id',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'feed_user_id_fk',
            columnNames: ['feed_user_id_fk'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'feed_module_id',
            columnNames: ['feed_module_id'],
            referencedTableName: 'modules',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
