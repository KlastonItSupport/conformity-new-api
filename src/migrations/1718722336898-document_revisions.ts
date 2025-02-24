import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// id
// revision_date
// description
// user_id
export class DocumentRevisions1718722336898 implements MigrationInterface {
  private readonly TABLE_NAME = 'document_revisions';
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
            name: 'revision_date',
            type: 'datetime',
          },
          {
            name: 'description',
            type: 'longtext',
          },
          {
            name: 'document_revisions_user_id_fk',
            type: 'varchar',
          },
          {
            name: 'document_revisions_document_id_fk',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'document_revisions_user_id_fk',
            columnNames: ['document_revisions_user_id_fk'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'document_revisions_document_id_fk',
            columnNames: ['document_revisions_document_id_fk'],
            referencedTableName: 'documents',
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
