import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// id
// document_department_permissions_document_fk
// document_department_permissions_department_fk
// isAuthorized

export class DocumentDepartmentPermissions1718910045607
  implements MigrationInterface
{
  private readonly TABLE_NAME = 'document_departments_permissions';

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
            name: 'document_department_permissions_document_fk',
            type: 'varchar',
          },
          {
            name: 'document_department_permissions_department_fk',
            type: 'varchar',
          },
          {
            name: 'is_authorized',
            type: 'boolean',
            default: false,
          },
        ],
        foreignKeys: [
          {
            name: 'document_department_permissions_document_fk',
            columnNames: ['document_department_permissions_document_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'documents',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'document_department_permissions_department_fk',
            columnNames: ['document_department_permissions_department_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'departaments',
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
