import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IndicatorAnswer } from './indicator-answer.entity';

@Entity('indicator_tasks')
export class IndicatorTasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'indicator_tasks_fk' })
  taskId: number;

  @Column({ name: 'indicator_tasks_indicator_fk' })
  indicatorId: number;

  @ManyToOne(
    () => IndicatorAnswer,
    (indicatorAnswer) => indicatorAnswer.indicatorTasks,
  )
  @JoinColumn({ name: 'indicator_tasks_indicator_fk' })
  indicatorAnswer: IndicatorAnswer;
}
