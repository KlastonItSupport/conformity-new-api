import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ name: 'company_id_fk' })
  companyId: string;

  @Column()
  name: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ default: true, name: 'access' })
  access: boolean;

  @Column({ default: false, name: 'contract_access' })
  contractAccess: boolean;

  @Column({ default: false, name: 'lead_access' })
  leadAccess: boolean;

  @Column({ default: false, name: 'project_access' })
  projectAccess: boolean;

  @Column({ nullable: true, name: 'access_rule' })
  accessRule: string;

  @Column({ nullable: true, name: 'departament' })
  departament: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column()
  status: string;
}
