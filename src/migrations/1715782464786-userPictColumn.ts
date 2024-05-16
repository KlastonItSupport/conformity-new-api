import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPictColumn1715782464786 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasUserPicColumn = await queryRunner.hasColumn(
      'users',
      'profile_pic',
    );

    if (!hasUserPicColumn) {
      await queryRunner.query(
        `ALTER TABLE users ADD COLUMN profile_pic VARCHAR(255) NULL`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'profile_pic');
  }
}
