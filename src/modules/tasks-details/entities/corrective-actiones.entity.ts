import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('task_corrective_actions')
export class TaskCorrectiveAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'corrective_actions_user_fk' })
  userId: string;

  @Column({ name: 'corrective_actions_task_fk' })
  taskId: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column()
  result: string;

  @Column()
  responsable: string;

  @Column()
  action: string;
}
