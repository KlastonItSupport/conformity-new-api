import { User } from 'src/modules/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tasks_immediate_actions')
export class ImmediateAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tasks_immediate_actions_user_fk' })
  userId: string;

  @Column({ name: 'tasks_immediate_actions_task_fk' })
  taskId: number;

  @Column()
  action: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ name: 'responsable' })
  responsable: string;

  @ManyToOne(() => User, (user) => user.immediateActions)
  @JoinColumn({ name: 'tasks_immediate_actions_user_fk' })
  user: User;
}
