import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UsersTrainings1729777514711 implements MigrationInterface {
  // id - autoincrement int - not null
  // userId_fk - varchar - not null
  // certificate_fk - int
  // training_fk - int
  // date - date
  private readonly TABLE_NAME = 'trainings_users';

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
            name: 'trainings_users_user_fk',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'trainings_users_certificate_fk',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'trainings_users_training_fk',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'trainings_users_user_fk',
            columnNames: ['trainings_users_user_fk'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'trainings_users_training_fk',
            columnNames: ['trainings_users_training_fk'],
            referencedTableName: 'trainings',
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
