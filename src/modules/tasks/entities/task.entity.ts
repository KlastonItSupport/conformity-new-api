import { Company } from 'src/modules/companies/entities/company.entity';
import { Departament } from 'src/modules/departaments/entities/departament.entity';
import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { TaskType } from './task-type.entity';
import { TaskOrigin } from './task-origin.entity';
import { TaskClassifications } from './task-classifications.entity';
import { TaskEvaluator } from 'src/modules/tasks-details/entities/evaluator.entity';
import { TaskSubtask } from 'src/modules/tasks-details/entities/relateds.entity';
import { Project } from 'src/modules/projects/entities/project.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'tasks_project_fk' })
  projectId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'tasks_users_fk' })
  user: User;

  @ManyToOne(() => Departament)
  @JoinColumn({ name: 'tasks_departament_fk' })
  departament: Departament;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'tasks_company_fk' })
  company: Company;

  @ManyToOne(() => TaskType)
  @JoinColumn({ name: 'tasks_type_fk' })
  type: TaskType;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'tasks_project_fk' })
  project: Project;

  @ManyToOne(() => TaskOrigin)
  @JoinColumn({ name: 'tasks_origin_fk' })
  origin: TaskOrigin;

  @ManyToOne(() => TaskClassifications)
  @JoinColumn({ name: 'tasks_classification_fk' })
  classification: TaskClassifications;

  @OneToMany(() => TaskEvaluator, (taskEvaluator) => taskEvaluator.task)
  taskEvaluators: TaskEvaluator[];

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'datetime', name: 'date_prevision' })
  datePrevision: string;

  @Column({ type: 'datetime', name: 'date_conclusion' })
  dateConclusion: Date;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', name: 'result_root_cause' })
  resultRootCause: string;

  @Column({ type: 'varchar', name: 'corrective_action' })
  correctiveAction: string;

  @Column({ type: 'varchar', name: 'immediate_action' })
  immediateAction: string;

  @Column({ type: 'varchar' })
  responsable: string;

  @Column({ type: 'varchar', name: 'date_corrective_action' })
  dateCorrectiveAction: string;

  @Column({ type: 'varchar', name: 'date_immediate_action' })
  dateImmediateAction: string;

  @OneToMany(() => TaskSubtask, (taskSubtask) => taskSubtask.task)
  subtasks: TaskSubtask[];

  projectName?: string;

  //   @Column({ name: 'tasks_project_fk' })
  //   projectId?: string;

  @Column({ name: 'tasks_users_fk' })
  userId?: string;

  //   @Column({ name: 'tasks_departament_fk' })
  //   departamentId?: string;

  //   @Column({ name: 'tasks_company_fk' })
  //   companyId: string;
}
