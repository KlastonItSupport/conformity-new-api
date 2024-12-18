import { Task } from 'src/modules/tasks/entities/task.entity';
import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('task_evaluators')
export class TaskEvaluator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'task_evaluator_task_fk', type: 'int' })
  taskId: number;

  @Column({ name: 'task_evaluator_user_fk', type: 'int' })
  userId: string;

  @Column({ type: 'int' })
  analyzed: number;

  @Column({ type: 'varchar', nullable: true })
  data: string;

  @ManyToOne(() => Task, (task) => task.taskEvaluators, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'task_evaluator_task_fk' })
  task: Task;

  @ManyToOne(() => User, (user) => user.taskEvaluators, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'task_evaluator_user_fk' })
  user: User;
}
