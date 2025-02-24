import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { Project } from 'src/modules/projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'crm_companies' })
export class CrmCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_fk', type: 'varchar', nullable: false })
  companyId: string;

  @Column({ name: 'client_type', type: 'varchar', nullable: true })
  clientType: string;

  @Column({ name: 'person_type', type: 'varchar', nullable: true })
  personType?: string;

  @Column({ name: 'social_reason', type: 'varchar', nullable: true })
  socialReason: string;

  @Column({ name: 'fantasy_name', type: 'varchar', nullable: true })
  fantasyName: string;

  @Column({ name: 'cnpj_cpf', type: 'varchar', nullable: true })
  cnpjCpf: string;

  @Column({ name: 'passport', type: 'varchar', nullable: true })
  passport: string;

  @Column({ name: 'nacionality', type: 'varchar', nullable: true })
  nacionality: string;

  @Column({ name: 'password', type: 'varchar', nullable: true })
  password: string;

  @Column({ name: 'city_subscription', type: 'varchar', nullable: true })
  citySubscription: string;

  @Column({ name: 'state_subscription', type: 'varchar', nullable: true })
  stateSubscription: string;

  @Column({ name: 'contact', type: 'varchar', nullable: true })
  contact: string;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string;

  @Column({ name: 'celphone', type: 'varchar', nullable: true })
  celphone: string;

  @Column({ name: 'cep', type: 'varchar', nullable: true })
  cep: string;

  @Column({ name: 'city', type: 'varchar', nullable: true })
  city: string;

  @Column({ name: 'neighborhood', type: 'varchar', nullable: true })
  neighborhood: string;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address: string;

  @Column({ name: 'address_number', type: 'varchar', nullable: true })
  number: string;

  @Column({ name: 'address_complement', type: 'varchar', nullable: true })
  addressComplement: string;

  @Column({ name: 'state', type: 'varchar', nullable: true })
  state: string;

  @Column({ name: 'supplier', type: 'boolean', default: false, nullable: true })
  supplier: boolean;

  @Column({ name: 'client', type: 'boolean', default: false, nullable: true })
  client: boolean;

  @Column({ name: 'status', type: 'varchar', nullable: false })
  status: string;

  @Column({ name: 'cf', type: 'tinyint', default: 0, nullable: false })
  cf: number;

  @OneToMany(() => Contract, (contract) => contract.crmCompany)
  contracts: Contract[];

  @OneToMany(() => Project, (project) => project.crmCompany)
  projects: Project[];
}
