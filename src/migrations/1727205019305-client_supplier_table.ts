import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ClientSupplierTable1727205019305 implements MigrationInterface {
  // id - auto generated
  // company_fk -varchar
  // client_type - varchar
  // social_reason - varchar
  // fantasy_name - varchar
  // cnpj_cpf - varhcar
  // passport - varchar
  // nacionality - varchar
  // password - varchar
  // city_subscription- varchar
  // state_subscription - varchar
  // contact - varchar
  // email - varchar
  // celphone - varchar
  // cep - varchar
  // city - varchar
  // neighborhood - varchar
  // address - varchar
  // address_number- varchar
  // address_complement - varhcar
  // supplier - boolean
  // client - boolean
  // status - varchar
  // cf - tinyint
  private readonly TABLE_NAME = 'crm_companies';
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
            name: 'company_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'client_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'social_reason',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'fantasy_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cnpj_cpf',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'passport',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'nacionality',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'city_subscription',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'state_subscription',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contact',
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
            name: 'cep',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'neighborhood',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address_complement',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'supplier',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'client',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'cf',
            type: 'tinyint',
            default: 0,
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'crm_companies_company_fk',
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            columnNames: ['company_fk'],
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
