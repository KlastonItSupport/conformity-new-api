import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TasksLeads1727789361580 implements MigrationInterface {
  private readonly TABLE_NAME = 'leads_tasks';
  //   id - int auto increment
  //   lead_fk_id - int
  //   user_fk_id - varchar
  //   type - varchar
  //   description - varchar
  //   date - date
  //   is_a_reminder - boolean
  //   has_been_reminded - boolean
  //   time - varchar
  //   completed - boolean

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
            name: 'lead_fk_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'tasks_lead_user_fk_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'is_a_reminder',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'has_been_reminded',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'time',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'completed',
            type: 'boolean',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'lead_fk_id',
            columnNames: ['lead_fk_id'],
            referencedTableName: 'leads',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'tasks_lead_user_fk_id',
            columnNames: ['tasks_lead_user_fk_id'],
            referencedTableName: 'users',
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
