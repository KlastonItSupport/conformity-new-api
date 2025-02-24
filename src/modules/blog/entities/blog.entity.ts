import { Company } from 'src/modules/companies/entities/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { BlogCategory } from './category.entity';

@Entity('blog')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'blog_company_fk_id' })
  companyId: string;

  @Column({ name: 'blog_category_fk_id' })
  blogCategoryId: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'varchar', name: 'type' })
  status: string;

  @Column({ type: 'varchar' })
  seo: string;

  @Column({ type: 'longtext' })
  text: string;

  @Column({ type: 'varchar' })
  goal: string;

  @Column({ type: 'varchar' })
  tag: string;

  @Column({ type: 'varchar' })
  resume: string;

  @Column({ type: 'datetime', name: 'exbition_date' })
  exbitionDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Company, (company) => company.blog, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_company_fk_id' })
  company: Company;

  @ManyToOne(() => BlogCategory, (category) => category.blogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_category_fk_id' })
  category: BlogCategory;
}
