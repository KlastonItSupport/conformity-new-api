import { CrmCompany } from 'src/modules/crm-companies/entities/crm-company.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'contracts' })
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contracts_company_fk', type: 'varchar', nullable: true })
  companyId: string;

  @ManyToOne(() => CrmCompany, (crmCompany) => crmCompany.contracts)
  @JoinColumn({ name: 'crm_companies_fk' }) // Nome correto da coluna no banco
  crmCompany: CrmCompany;

  @Column({ name: 'crm_companies_fk', type: 'int', nullable: true })
  crmCompaniesId: number;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ name: 'initial_date', type: 'date', nullable: true })
  initialDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', nullable: true })
  value: string;

  @Column({ type: 'varchar', nullable: true })
  link: string;

  @Column({ type: 'varchar', nullable: true })
  details: string;

  @Column({ type: 'varchar', nullable: false })
  status: string;
}
