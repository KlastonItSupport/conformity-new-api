import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangingRetentionColumnType1717702135155
  implements MigrationInterface
{
  private readonly tableName = 'documents';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ${this.tableName} 
      MODIFY COLUMN minimum_retention INT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ${this.tableName} 
      MODIFY COLUMN minimum_retention DATE; 
    `);
  }
}
