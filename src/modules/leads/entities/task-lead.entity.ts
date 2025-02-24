import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from './leads.entity';
import { User } from 'src/modules/users/entities/users.entity';

@Entity({ name: 'leads_tasks' })
export class LeadTask {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lead, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lead_fk_id' })
  lead: Lead;

  @Column({ name: 'lead_fk_id', type: 'int', nullable: true })
  leadId: number;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'tasks_lead_user_fk_id' })
  user: User;

  @Column({ name: 'tasks_lead_user_fk_id', type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ name: 'is_a_reminder', type: 'boolean', nullable: true })
  isReminder: boolean;

  @Column({ name: 'has_been_reminded', type: 'boolean', nullable: true })
  hasBeenReminded: boolean;

  @Column({ type: 'varchar', nullable: true })
  time: string;

  @Column({ type: 'boolean', nullable: true })
  completed: boolean;
}
