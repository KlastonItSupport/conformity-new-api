import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tasks_checklist')
export class TaskChecklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'checklist_subtask_fk' })
  subtaskId: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: false, name: 'is_completed' })
  isCompleted?: boolean;
}
