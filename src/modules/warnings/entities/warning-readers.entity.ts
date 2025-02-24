import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Warning } from './warning.entity';

@Entity('warnings_readers')
export class WarningReader {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'readers_user_fk' })
  userId: string;

  @Column({ name: 'readers_warning_fk' })
  warningId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.warningReaders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'readers_user_fk' })
  user: User;

  @ManyToOne(() => Warning, (warning) => warning.warningReaders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'readers_warning_fk' })
  warning: Warning;
}
