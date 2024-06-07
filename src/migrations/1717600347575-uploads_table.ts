import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// id ,
// name,
// storage_key,
// link,
// path,
// size,
// type,
// ext,
// module,
// module_key,
// company_id,
// created_at,

export class UploadsTable1717600347575 implements MigrationInterface {
  private readonly tableName = 'uploads';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
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
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'storage_key',
            type: 'varchar',
          },
          {
            name: 'link',
            type: 'varchar',
          },
          {
            name: 'path',
            type: 'varchar',
          },
          {
            name: 'size',
            type: 'int',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'ext',
            type: 'varchar',
          },
          {
            name: 'module',
            type: 'varchar',
          },
          {
            name: 'uploads_module_id_fk',
            type: 'varchar',
          },
          {
            name: 'uploads_company_id_fk',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'uploads_company_id_fk',
            columnNames: ['uploads_company_id_fk'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'uploads_module_id_fk',
            columnNames: ['uploads_module_id_fk'],
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
    await queryRunner.dropTable(this.tableName);
  }
}
