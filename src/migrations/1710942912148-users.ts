import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1710942912148 implements MigrationInterface {
  private TABLE_NAME = 'users';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'company_id_fk', type: 'varchar' },
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
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
          },
          {
            name: 'access',
            type: 'boolean',
          },
          {
            name: 'contract_access',
            type: 'boolean',
          },
          {
            name: 'lead_access',
            type: 'boolean',
          },
          {
            name: 'project_access',
            type: 'boolean',
          },
          {
            name: 'access_rule',
            type: 'varchar',
          },
          {
            name: 'departament',
            type: 'varchar',
          },
          {
            name: 'birthday',
            type: 'date',
          },
          { name: 'status', type: 'varchar' },
        ],
        foreignKeys: [
          {
            name: 'company_id_fk',
            columnNames: ['company_id_fk'],
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
