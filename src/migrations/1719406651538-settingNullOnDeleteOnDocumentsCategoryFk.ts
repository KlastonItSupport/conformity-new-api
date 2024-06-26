import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class SettingNullOnDeleteOnDocumentsCategoryFk1719406651538
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'documents',
      'document_category_fk',
      new TableColumn({
        name: 'document_category_fk',
        type: 'varchar',
        isNullable: true,
      }),
    );

    const table = await queryRunner.getTable('documents');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('document_category_fk') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('documents', foreignKey);
    }

    await queryRunner.createForeignKey(
      'documents',
      new TableForeignKey({
        name: 'document_category_fk',
        columnNames: ['document_category_fk'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('documents');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('document_category_fk') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('documents', foreignKey);
    }

    await queryRunner.changeColumn(
      'documents',
      'document_category_fk',
      new TableColumn({
        name: 'document_category_fk',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'documents',
      new TableForeignKey({
        name: 'document_category_fk',
        columnNames: ['document_category_fk'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
