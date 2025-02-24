// error-log.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('responses_logs')
export class ErrorLog {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ type: 'text' })
  headers: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  route: string;
}
