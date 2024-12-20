import { Audit } from 'src/modules/audit/entities/audit.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Evaluators } from 'src/modules/evaluators/entities/evaluators.entity';
import { Feed } from 'src/modules/feed/entities/feed.entity';
import { TasksDeadlinesHistory } from 'src/modules/tasks-details/entities/deadlines.entity';
import { TaskEvaluator } from 'src/modules/tasks-details/entities/evaluator.entity';
import { ImmediateAction } from 'src/modules/tasks-details/entities/immediate-actions.entity';
import { TaskIshikawa } from 'src/modules/tasks-details/entities/ishikawa.entity';
import { TaskRootCauseAnalysis } from 'src/modules/tasks-details/entities/root-cause-analysis.entity';
import { TrainingUser } from 'src/modules/user-trainings/entities/user-training.entity';
import { WarningReader } from 'src/modules/warnings/entities/warning-readers.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ name: 'company_id_fk' })
  companyId: string;

  @Column()
  name: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ default: true, name: 'access' })
  access: boolean;

  @Column({ default: false, name: 'contract_access' })
  contractAccess?: boolean;

  @Column({ default: false, name: 'lead_access' })
  leadAccess?: boolean;

  @Column({ default: false, name: 'project_access' })
  projectAccess?: boolean;

  @Column({ nullable: true, name: 'access_rule' })
  accessRule: string;

  @Column({ nullable: true, name: 'celphone' })
  celphone: string;

  @Column({ nullable: true, name: 'departament' })
  departament: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ name: 'profile_pic' })
  profilePic?: string;

  @Column()
  status: string;

  companyName?: string;

  @ManyToOne(() => Company, (company) => company.users, { eager: false })
  @JoinColumn({ name: 'company_id_fk' })
  company: Company;

  @OneToMany(() => Feed, (feed) => feed.user)
  feeds: Feed[];

  @OneToMany(() => Evaluators, (evaluator) => evaluator.user)
  approvals: Evaluators[];

  @OneToMany(() => TaskEvaluator, (taskEvaluator) => taskEvaluator.user)
  taskEvaluators: TaskEvaluator[];

  @OneToMany(
    () => TasksDeadlinesHistory,
    (tasksDeadlinesHistory) => tasksDeadlinesHistory.user,
  )
  tasksDeadlinesHistories: TasksDeadlinesHistory[];

  @OneToMany(
    () => TaskRootCauseAnalysis,
    (taskRootCauseAnalysis) => taskRootCauseAnalysis.user,
  )
  taskRootCauseAnalyses: TaskRootCauseAnalysis[];

  @OneToMany(() => ImmediateAction, (immediateAction) => immediateAction.user)
  immediateActions: ImmediateAction[];

  @OneToMany(() => TaskIshikawa, (taskIshikawa) => taskIshikawa.user)
  ishikawa: TaskIshikawa[];

  @OneToMany(() => TrainingUser, (trainingUser) => trainingUser.user)
  trainings: TrainingUser[];

  @OneToMany(() => WarningReader, (warningReader) => warningReader.user)
  warningReaders: WarningReader[];

  @OneToMany(() => Audit, (audit) => audit.user)
  audits: Audit[];
}
