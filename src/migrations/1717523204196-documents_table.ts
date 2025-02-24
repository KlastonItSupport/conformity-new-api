import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DocumentsTable1717523204196 implements MigrationInterface {
  private TABLE_NAME = 'documents';

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
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'author',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'validity',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'revision',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'description',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'owner',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'local',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'identification',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'protection',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'recovery',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'minimum_retention',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'revision_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'document_company_fk',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'document_category_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'document_departament_fk',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'document_company_fk',
            columnNames: ['document_company_fk'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'document_category_fk',
            columnNames: ['document_category_fk'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'document_departament_fk',
            columnNames: ['document_departament_fk'],
            referencedTableName: 'departaments',
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
