import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// id
// main_doc_documents_fk
// side_doc_documents_fk
export class DocumentsRelateds1718824568889 implements MigrationInterface {
  private readonly TABLE_NAME = 'documents_related';
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
            name: 'main_doc_documents_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'side_doc_documents_fk',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'main_doc_documents_fk',
            columnNames: ['main_doc_documents_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'documents',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'side_doc_documents_fk',
            columnNames: ['side_doc_documents_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'documents',
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
