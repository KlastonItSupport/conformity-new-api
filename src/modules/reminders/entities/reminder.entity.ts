import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'reminders' })
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  module: string;

  @Column()
  key: string;

  @Column()
  frequency: string;

  @Column()
  hour: string;

  @Column({ name: 'date_last_reminder' })
  dateLastReminder: Date;

  @Column({ name: 'data_end' })
  dataEnd: Date;

  @Column()
  status: string;

  @Column()
  monday: number;

  @Column()
  tuesday: number;

  @Column()
  wednesday: number;

  @Column()
  thursday: number;

  @Column()
  friday: number;

  @Column()
  saturday: number;

  @Column()
  sunday: number;

  @Column({ name: 'week_day' })
  weekDay: string;

  @Column({ name: 'close_day' })
  closeDay: Date;

  @Column()
  text: string;
}
