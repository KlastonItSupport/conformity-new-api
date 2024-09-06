import { Departament } from 'src/modules/departaments/entities/departament.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IndicatorAnswer } from './indicator-answer.entity';

@Entity('indicators')
export class Indicator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'indicators_company_fk' })
  companyId: string;

  @Column({ name: 'indicators_department_fk' })
  departamentId: string;

  @ManyToOne(() => Departament, (department) => department.indicators, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'indicators_department_fk' })
  department: Departament;

  @Column({ type: 'int', name: 'collect_day', nullable: true })
  collectDay: number;

  @Column({ type: 'varchar' })
  responsable: string;

  @Column({ type: 'text' })
  goal: string;

  @Column({ type: 'varchar' })
  frequency: string;

  @Column({ type: 'varchar', name: 'data_type' })
  dataType: string;

  @Column({ type: 'varchar' })
  meta: string;

  @Column({ type: 'text', name: 'how_to_measure' })
  howToMeasure: string;

  @Column({ type: 'text', name: 'what_to_measure' })
  whatToMeasure: string;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({ type: 'varchar' })
  direction: string;

  @OneToMany(
    () => IndicatorAnswer,
    (indicatorAnswer) => indicatorAnswer.indicator,
  )
  indicatorAnswers: IndicatorAnswer[];

  status?: string;
}
