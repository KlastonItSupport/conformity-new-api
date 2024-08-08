import { Company } from 'src/modules/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('task_classifications')
export class TaskClassifications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'task_classifications_company_fk' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'task_classifications_company_fk' })
  company: Company;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar' })
  name: string;
}
