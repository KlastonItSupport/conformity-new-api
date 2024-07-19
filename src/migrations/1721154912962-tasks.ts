import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Tasks1721154912962 implements MigrationInterface {
  private readonly TABLE_NAME = 'tasks';
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
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'tasks_project_fk',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tasks_users_fk',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tasks_departament_fk',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tasks_company_fk',
            type: 'varchar',
          },
          {
            name: 'tasks_type_fk',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'tasks_origin_fk',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'tasks_classification_fk',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'date_prevision',
            type: 'date',
          },
          {
            name: 'date_conclusion',
            type: 'datetime',
            isNullable: true,
          },

          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'result_root_cause',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'corrective_action',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'immediate_action',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'responsable',
            type: 'varchar',
          },
          {
            name: 'date_corrective_action',
            isNullable: true,
            type: 'varchar',
          },
          {
            name: 'date_immediate_action',
            type: 'varchar',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'tasks_project_fk',
            columnNames: ['tasks_project_fk'],
            referencedTableName: 'projects',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'tasks_users_fk',
            columnNames: ['tasks_users_fk'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'tasks_departament_fk',
            columnNames: ['tasks_departament_fk'],
            referencedTableName: 'departaments',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'tasks_company_fk',
            columnNames: ['tasks_company_fk'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'tasks_origin_fk',
            columnNames: ['tasks_origin_fk'],
            referencedTableName: 'task_origins',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'tasks_type_fk',
            columnNames: ['tasks_type_fk'],
            referencedTableName: 'task_types',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'tasks_classification_fk',
            columnNames: ['tasks_classification_fk'],
            referencedTableName: 'task_classifications',
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
