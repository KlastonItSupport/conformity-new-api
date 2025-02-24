import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Permissions1712755693176 implements MigrationInterface {
  private readonly TABLE_NAME = 'permissions';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          {
            name: 'fk_modules_id',
            type: 'varchar',
          },
          {
            name: 'fk_user_id',
            type: 'varchar',
          },
          {
            name: 'can_read',
            type: 'tinyint',
          },
          {
            name: 'can_add',
            type: 'tinyint',
          },
          {
            name: 'can_edit',
            type: 'tinyint',
          },
          {
            name: 'can_delete',
            type: 'tinyint',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_modules_id',
            columnNames: ['fk_modules_id'],
            referencedTableName: 'modules',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'fk_user_id',
            columnNames: ['fk_user_id'],
            referencedTableName: 'users',
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
