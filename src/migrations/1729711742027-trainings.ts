import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Trainings1729711742027 implements MigrationInterface {
  private readonly TABLE_NAME = 'trainings';
  // id - auto increment int
  // name - varchar
  // training_school_fk - number
  // trainings_company_fk -varchar
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
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expiration_in_months',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'training_school_fk',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'trainings_company_fk',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'training_school_fk',
            columnNames: ['training_school_fk'],
            referencedTableName: 'schools',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'trainings_company_fk',
            columnNames: ['trainings_company_fk'],
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
