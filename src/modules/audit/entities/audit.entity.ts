import { Company } from 'src/modules/companies/entities/company.entity';
import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('audit')
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'audit_company_fk' })
  company: Company;

  @Column({ name: 'audit_company_fk', type: 'varchar' })
  companyId: string;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'audit_user__fk' })
  user: User;

  @Column({ name: 'audit_user__fk' })
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  key: string;

  @Column({ type: 'varchar', nullable: true })
  class: string;

  @Column({ type: 'varchar', nullable: true })
  method: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  complement: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  module: string;
}
