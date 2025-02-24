import { Training } from 'src/modules/trainings/entities/training.entity';
import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity('trainings_users')
export class TrainingUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.trainings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'trainings_users_user_fk' })
  user: User;

  @Column({
    name: 'trainings_users_certificate_fk',
    type: 'varchar',
    nullable: true,
  })
  certificateId: string;

  @Column({ name: 'trainings_users_user_fk' })
  userId: string;

  @ManyToOne(() => Training, (training) => training.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'trainings_users_training_fk' })
  training: Training;

  @Column({ name: 'trainings_users_training_fk' })
  trainingId: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  trainingName?: string;
  expirationInMonths?: number;
}
