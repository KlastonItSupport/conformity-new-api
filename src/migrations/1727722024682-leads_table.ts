import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class LeadsTable1727722024682 implements MigrationInterface {
  private readonly TABLE_NAME = 'leads';

  //   id - int auto increment
  // company_fk - varchar
  // user_id_fk - varchar
  // crm_companies_fk - int
  // type - varchar
  // status - varchar
  // responsable - varchar
  // reference - varchar
  // description - varchar
  // date - date
  // contact - varchar
  // contract - varchar
  // value - varchar
  // email - varchar
  // celphone - varchar
  // solicitation_month - int
  // solicitation_year - int
  // updated_at - date

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
            name: 'leads_company_fk',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'leads_user_id_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'leads_crm_companies_fk',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'responsable',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'reference',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'contact',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contract',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'value',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'celphone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'solicitation_month',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'solicitation_year',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'date',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'leads_company_fk',
            columnNames: ['leads_company_fk'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'leads_user_id_fk',
            columnNames: ['leads_user_id_fk'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'leads_crm_companies_fk',
            columnNames: ['leads_crm_companies_fk'],
            referencedTableName: 'crm_companies',
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
