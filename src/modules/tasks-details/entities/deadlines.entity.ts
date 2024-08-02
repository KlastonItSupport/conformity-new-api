import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('tasks_deadlines_history')
export class TasksDeadlinesHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'task_deadline_history_user_fk' })
  userId: string;

  @Column({ name: 'task_deadline_history_task_fk' })
  taskId: number;

  @Column({ type: 'datetime', name: 'old_date' })
  oldDate: Date;

  @Column({ type: 'datetime', name: 'new_date' })
  newDate: Date;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => User, (user) => user.tasksDeadlinesHistories)
  @JoinColumn({ name: 'task_deadline_history_user_fk' })
  user: User;
}
