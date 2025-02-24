import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Company } from 'src/modules/companies/entities/company.entity';

@Entity('task_types')
export class TaskType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'task_types_company_fk' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'task_types_company_fk' })
  company: Company;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar' })
  name: string;
}
