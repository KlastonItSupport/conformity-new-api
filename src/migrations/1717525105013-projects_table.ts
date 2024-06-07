import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// id,
// client_name,
// progress,
// title,
// text,
// status,
// initial_date,
// final_date,
// company_fk
export class ProjectsTable1717525105013 implements MigrationInterface {
  private TABLE_NAME = 'projects';

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
            name: 'client_name',
            type: 'varchar',
          },
          {
            name: 'progress',
            type: 'varchar',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'text',
            type: 'longtext',
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'initial_date',
            type: 'date',
          },
          {
            name: 'final_date',
            type: 'date',
          },
          {
            name: 'project_company_fk',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'project_company_fk',
            columnNames: ['project_company_fk'],
            referencedTableName: 'companies',
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
