import { CrmCompany } from 'src/modules/crm-companies/entities/crm-company.entity';
import { Document } from 'src/modules/documents/entities/document.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  progress: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'longtext' })
  text: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'date', name: 'initial_date' })
  initialDate: Date;

  @Column({ type: 'date', name: 'final_date' })
  finalDate: Date;

  @Column({ name: 'project_company_fk', type: 'varchar' })
  companyId: string;

  @Column({ name: 'projects_crm_companies_fk', type: 'int' })
  crmCompanyId: number;

  @Column({
    name: 'update_progress_automatically',
    type: 'boolean',
    default: true,
  })
  updateProgressAutomatically: boolean;

  @ManyToOne(() => CrmCompany, (crmCompany) => crmCompany.projects)
  @JoinColumn({ name: 'projects_crm_companies_fk' })
  crmCompany: CrmCompany;

  @OneToMany(() => Document, (document) => document.project)
  documents: Document[];

  @OneToMany(() => Task, (document) => document.project)
  tasks: Task[];
}
