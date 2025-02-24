import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('tasks_root_cause_analysis')
export class TaskRootCauseAnalysis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'root_cause_analysis_user_fk' })
  userId: string;

  @Column({ name: 'root_cause_analysis_task_fk' })
  taskId: number;

  @Column()
  why: string;

  @Column()
  answer: string;

  @Column({ type: 'datetime' })
  date: Date;

  responsable?: string;

  @ManyToOne(() => User, (user) => user.taskRootCauseAnalyses)
  @JoinColumn({ name: 'root_cause_analysis_user_fk' })
  user: User;
}
