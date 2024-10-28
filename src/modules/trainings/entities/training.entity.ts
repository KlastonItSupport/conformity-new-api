import { Company } from 'src/modules/companies/entities/company.entity';
import { School } from 'src/modules/schools/entities/schools.entity';
import { TrainingUser } from 'src/modules/user-trainings/entities/user-training.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('trainings')
export class Training {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @ManyToOne(() => School, (school) => school.trainings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'training_school_fk' })
  school: School;

  @Column({ name: 'training_school_fk', type: 'int', nullable: true })
  schoolId: number;

  @ManyToOne(() => Company, (company) => company.trainings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'trainings_company_fk' })
  company: Company;

  @Column({ name: 'trainings_company_fk', type: 'varchar', nullable: true })
  companyId: string;

  @Column({ name: 'expiration_in_months', type: 'int', nullable: true })
  expirationInMonths: number;

  companyName?: string;
  schoolName?: string;

  @OneToMany(() => TrainingUser, (trainingUser) => trainingUser.training)
  users: TrainingUser[];
}
