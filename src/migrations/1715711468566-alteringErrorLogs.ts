import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlteringErrorLogs1715711468566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE responses_logs
        MODIFY body longtext NULL,
        MODIFY headers longtext NULL,
        MODIFY route longtext NULL;
        
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE responses_logs
    MODIFY body VARCHAR(255) NULL,
    MODIFY headers VARCHAR(255) NULL,
    MODIFY route VARCHAR(255) NULL;
  `);
  }
}
