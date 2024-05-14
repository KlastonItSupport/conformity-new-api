import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlteringUsersTable1713272724036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasCelphoneColumn = await queryRunner.hasColumn('users', 'celphone');
    if (!hasCelphoneColumn) {
      await queryRunner.query(
        `ALTER TABLE users ADD COLUMN celphone VARCHAR(255) NULL`,
      );
    }

    await queryRunner.query(`
      ALTER TABLE users
      MODIFY birthday VARCHAR(255) NULL,
      MODIFY access_rule VARCHAR(255) NULL,
      MODIFY project_access BOOLEAN NULL,
      MODIFY lead_access BOOLEAN NULL,
      MODIFY contract_access BOOLEAN NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE users
    DROP COLUMN celphone,
    MODIFY birthday VARCHAR(255) NULL,
    MODIFY access_rule VARCHAR(255) NULL,
    MODIFY project_access TINYINT NULL,
    MODIFY lead_access TINYINT NULL,
    MODIFY contract_access TINYINT NULL;
  `);
  }
}
