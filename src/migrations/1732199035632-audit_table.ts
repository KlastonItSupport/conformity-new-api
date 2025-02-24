import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AuditTable1732199035632 implements MigrationInterface {
  private readonly TABLE_NAME = 'audit';

  //   id - int auto increment
  // company_fk - varchar
  // user_id_fk - varchar
  // key - varchar nullable
  // class - varchar nullable
  // method - varchar nullable
  // type - varchar nullable
  // created_at - date now nullable
  // complement - text nullable
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
            name: 'audit_company_fk',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'audit_user__fk',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'key',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'class',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'method',
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
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: true,
          },
          {
            name: 'complement',
            type: 'text',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'audit_company_fk',
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            columnNames: ['audit_company_fk'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'audit_user__fk',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['audit_user__fk'],
            onDelete: 'SET NULL',
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
