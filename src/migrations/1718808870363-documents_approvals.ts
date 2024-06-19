import { MigrationInterface, QueryRunner, Table } from 'typeorm';
// id,
// created_at,
// document_id_fk
// user_id_fk
// approved
// reviewed
// cancelled
// deleted
// edited
// cancel_description

export class DocumentsApprovals1718808870363 implements MigrationInterface {
  private readonly TABLE_NAME = 'documents_approvals';
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
            name: 'document_approvals_document_id_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'document_approvals_user_id_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'approved',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'reviewed',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'cancelled',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'deleted',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'edited',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'cancel_description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'document_approvals_document_id_fk',
            columnNames: ['document_approvals_document_id_fk'],
            referencedTableName: 'documents',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'document_approvals_user_id_fk',
            columnNames: ['document_approvals_user_id_fk'],
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
