import { Task } from 'src/modules/tasks/entities/task.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('tasks_subtasks')
export class TaskSubtask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tasks_subtask_task_fk' })
  taskId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'date', name: 'initial_date' })
  initialDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'int', default: false })
  order?: number;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @ManyToOne(() => Task, (task) => task.subtasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tasks_subtask_task_fk' })
  task: Task;

  // @OneToMany(() => TaskChecklist, (checklist) => checklist.subtask)
  // checklist: TaskChecklist[];
}
