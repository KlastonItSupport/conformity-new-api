import { Audit } from 'src/modules/audit/entities/audit.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { BlogCategory } from 'src/modules/blog/entities/category.entity';
import { School } from 'src/modules/schools/entities/schools.entity';
import { Training } from 'src/modules/trainings/entities/training.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { Warning } from 'src/modules/warnings/entities/warning.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'memory_limit' })
  memoryLimit: number;

  @Column({ name: 'users_limit' })
  usersLimit: number;

  @Column()
  number: number;

  @Column()
  contact: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column()
  celphone: string;

  @Column()
  city: string;

  @Column()
  neighborhood: string;

  @Column()
  address: string;

  @Column()
  complement: string;

  @Column({ unique: true })
  email: string;

  @Column()
  status: string;

  @OneToMany(() => School, (school) => school.company)
  schools: School[];

  @OneToMany(() => Training, (training) => training.company)
  trainings: Training[];

  @OneToMany(() => Warning, (warnings) => warnings.company)
  warnings: Warning[];

  @OneToMany(() => Audit, (audit) => audit.company)
  audits: Audit[];

  @OneToMany(() => BlogCategory, (blogCategory) => blogCategory.company)
  blogCategories: BlogCategory[];

  @OneToMany(() => Blog, (blog) => blog.company)
  blog: Blog[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
