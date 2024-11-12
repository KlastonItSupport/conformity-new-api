import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Roles1731348676573 implements MigrationInterface {
  private readonly TABLE_NAME = 'roles';

  //   id - int auto increment
  // created_at - timestamp
  // companies_fk - varchar
  // name - varchar
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
            name: 'role_company_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'fk_role_company_fk',
            columnNames: ['role_company_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'companies',
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
