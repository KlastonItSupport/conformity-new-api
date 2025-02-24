import { CrmCompany } from 'src/modules/crm-companies/entities/crm-company.entity';
import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'leads' })
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'leads_company_fk', type: 'varchar', nullable: true })
  companyId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'leads_user_id_fk' })
  user: User;

  @Column({ name: 'leads_user_id_fk', type: 'varchar', nullable: false })
  userId: string;

  @ManyToOne(() => CrmCompany, { nullable: false })
  @JoinColumn({ name: 'leads_crm_companies_fk' })
  crmCompany: CrmCompany;

  @Column({ name: 'leads_crm_companies_fk', type: 'int', nullable: false })
  crmCompanyId: number;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @Column({ type: 'varchar', nullable: false })
  responsable: string;

  @Column({ type: 'varchar', nullable: false })
  reference: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'varchar', nullable: true })
  contact: string;

  @Column({ type: 'varchar', nullable: true })
  contract: string;

  @Column({ type: 'varchar', nullable: true })
  value: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  celphone: string;

  @Column({ name: 'solicitation_month', type: 'int', nullable: true })
  solicitationMonth: number;

  @Column({ name: 'solicitation_year', type: 'int', nullable: true })
  solicitationYear: number;

  @Column({ name: 'updated_at', type: 'datetime', nullable: true })
  updatedAt: Date;

  username: string;
  crmCompanyName: string;
}
