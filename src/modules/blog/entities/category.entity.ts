import { Company } from 'src/modules/companies/entities/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity('blog_categories')
export class BlogCategory {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'blog_categories_company_fk' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.blogCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_categories_company_fk' })
  company: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  name: string;

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs: Blog[];
}
