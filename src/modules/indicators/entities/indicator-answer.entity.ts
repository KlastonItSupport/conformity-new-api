import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Indicator } from './indicators.entity';
import { IndicatorTasks } from './indicator-tasks.entity';

@Entity('indicator_answers')
export class IndicatorAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'indicator_answers_company_fk' })
  companyId: string;

  @Column({ name: 'indicator_fk' })
  indicatorId: number;

  @ManyToOne(() => Indicator, (indicator) => indicator.indicatorAnswers)
  @JoinColumn({ name: 'indicator_fk' })
  indicator: Indicator;

  @OneToMany(
    () => IndicatorTasks,
    (indicatorTask) => indicatorTask.indicatorAnswer,
  )
  indicatorTasks: IndicatorTasks[];

  @Column({ type: 'text' })
  goal: string;

  @Column({ type: 'varchar' })
  answer: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  reason: string;
}
