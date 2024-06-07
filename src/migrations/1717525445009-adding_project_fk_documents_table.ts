import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddingProjectFkDocumentsTable1717525445009
  implements MigrationInterface
{
  private TABLE_NAME = 'documents';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE_NAME,
      new TableColumn({
        name: 'document_project_fk',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      this.TABLE_NAME,
      new TableForeignKey({
        columnNames: ['document_project_fk'],
        referencedTableName: 'projects',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'fk_documents_project',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.TABLE_NAME);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('document_project_fk') !== -1,
    );

    await queryRunner.dropForeignKey(this.TABLE_NAME, foreignKey);

    await queryRunner.dropColumn(this.TABLE_NAME, 'document_project_fk');
  }
}
