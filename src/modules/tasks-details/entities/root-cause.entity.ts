import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('task_root_cause')
export class TaskRootCause {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'root_cause_user_fk' })
  userId: string;

  @Column({ name: 'root_cause_task_fk' })
  taskId: number;

  @Column({ name: 'root_cause' })
  rootCause: string;
}
