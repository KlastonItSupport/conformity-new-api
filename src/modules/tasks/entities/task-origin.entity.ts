import { Company } from 'src/modules/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('task_origins')
export class TaskOrigin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'origin_company_fk' })
  company: Company;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar' })
  name: string;
}
