import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BlogTable1733923483150 implements MigrationInterface {
  private readonly TABLE_NAME = 'blog';

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
            unsigned: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'title', type: 'varchar' },
          { name: 'author', type: 'varchar' },
          { name: 'type', type: 'varchar' },
          { name: 'seo', type: 'varchar' },
          { name: 'text', type: 'longtext' },
          { name: 'goal', type: 'varchar' },
          { name: 'tag', type: 'varchar' },
          { name: 'resume', type: 'varchar' },
          { name: 'exbition_date', type: 'datetime' },
          { name: 'blog_company_fk_id', type: 'varchar' },
          { name: 'blog_category_fk_id', type: 'int', unsigned: true },
        ],
        foreignKeys: [
          {
            name: 'blog_company_fk_id',
            columnNames: ['blog_company_fk_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'companies',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'blog_category_fk_id',
            columnNames: ['blog_category_fk_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'blog_categories',
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
