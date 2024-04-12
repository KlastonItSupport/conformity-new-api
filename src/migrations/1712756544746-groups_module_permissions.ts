import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class GroupsModulePermissions1712756544746
  implements MigrationInterface
{
  private readonly TABLE_NAME = 'group_module_permissions';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          {
            name: 'fk_group_id',
            type: 'varchar',
          },
          {
            name: 'fk_permissions',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_group_id',
            columnNames: ['fk_group_id'],
            referencedTableName: 'groups',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'fk_permissions',
            columnNames: ['fk_permissions'],
            referencedTableName: 'permissions',
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
