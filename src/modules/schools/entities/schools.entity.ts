import { Company } from 'src/modules/companies/entities/company.entity';
import { Training } from 'src/modules/trainings/entities/training.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => Company, (company) => company.schools, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'schools_company_fk' })
  company: Company;

  @Column({ name: 'schools_company_fk' })
  companyId: string;

  @Column({ type: 'varchar' })
  celphone: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  state: string;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  companyName: string;

  @OneToMany(() => Training, (training) => training.school)
  trainings: Training[];
}
