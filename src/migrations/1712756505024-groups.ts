import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Groups1712756505024 implements MigrationInterface {
  private readonly TABLE_NAME = 'groups';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'fk_company_id', type: 'varchar' },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'permissions',
            type: 'json',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_company_id',
            columnNames: ['fk_company_id'],
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
