import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('task_ish')
export class TaskIshikawa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ish_user_fk' })
  userId: string;

  @Column({ name: 'ish_task_fk' })
  taskId: number;

  @Column()
  method: string;

  @Column()
  machine: string;

  @Column()
  material: string;

  @Column({ name: 'work_hand' })
  workHand: string;

  @Column()
  measure: string;

  @Column()
  environment: string;

  responsable?: string;

  @ManyToOne(() => User, (user) => user.ishikawa)
  @JoinColumn({ name: 'ish_user_fk' })
  user: User;
}
