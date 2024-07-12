import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectFkNullable1720617539901 implements MigrationInterface {
  private readonly TABLE_NAME = 'documents';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE ${this.TABLE_NAME} 
        MODIFY COLUMN document_project_fk VARCHAR(255) NULL;
      `);

    await queryRunner.query(`
        ALTER TABLE ${this.TABLE_NAME} 
        MODIFY COLUMN document_departament_fk VARCHAR(255) NULL;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE ${this.TABLE_NAME} 
        MODIFY COLUMN document_project_fk VARCHAR(255) NOT NULL;
      `);
    await queryRunner.query(`
        ALTER TABLE ${this.TABLE_NAME} 
        MODIFY COLUMN document_departament_fk VARCHAR(255) NOT NULL;
      `);
  }
}
