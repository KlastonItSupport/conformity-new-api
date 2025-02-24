import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddingCrmCompaniesFkToProjectsTable1727361829853
  implements MigrationInterface
{
  private TABLE_NAME = 'projects';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.TABLE_NAME);
    const column = table?.findColumnByName('client_name');
    const crmCompanyColumn = table?.findColumnByName('crm_companies_fk');
    const projectCrmColumn = table?.findColumnByName(
      'projects_crm_companies_fk',
    );

    if (column) {
      await queryRunner.dropColumn(this.TABLE_NAME, 'client_name');
    }
    if (crmCompanyColumn) {
      await queryRunner.dropColumn(this.TABLE_NAME, 'crm_companies_fk');
    }

    if (!projectCrmColumn) {
      await queryRunner.addColumn(
        this.TABLE_NAME,
        new TableColumn({
          name: 'projects_crm_companies_fk',
          type: 'int',
        }),
      );

      await queryRunner.createForeignKey(
        this.TABLE_NAME,
        new TableForeignKey({
          columnNames: ['projects_crm_companies_fk'],
          referencedTableName: 'crm_companies',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          name: 'projects_crm_companies_fk',
        }),
      );
    }
    // await queryRunner.query(`
    //   ALTER TABLE ${this.TABLE_NAME} MODIFY id INT AUTO_INCREMENT;
    // `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.TABLE_NAME);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('projects_crm_companies_fk') !== -1,
    );

    await queryRunner.dropForeignKey(this.TABLE_NAME, foreignKey);

    await queryRunner.dropColumn(this.TABLE_NAME, 'projects_crm_companies_fk');
  }
}
