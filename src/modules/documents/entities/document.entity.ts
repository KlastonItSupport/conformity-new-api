import { Category } from 'src/modules/categories/entities/category.entity';
import { Departament } from 'src/modules/departaments/entities/departament.entity';
import { DocumentRevision } from 'src/modules/document-revisions/entities/document-revision.entity';
import { Evaluators } from 'src/modules/evaluators/entities/evaluators.entity';
import { Project } from 'src/modules/projects/entities/project.entity';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'status' })
  status: string;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'author' })
  author?: string;

  @Column({ type: 'varchar', length: 255, name: 'validity' })
  validity: string;

  @Column({ type: 'int', nullable: true, name: 'revision' })
  revision?: number;

  @Column({ type: 'longtext', nullable: true, name: 'description' })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'type' })
  type?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'owner' })
  owner?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'local' })
  local?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'identification',
  })
  identification?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'protection' })
  protection?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'recovery' })
  recovery?: string;

  @Column({ name: 'minimum_retention', type: 'timestamp', nullable: true })
  minimumRetention?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true, name: 'revision_date' })
  revisionDate?: Date;

  @Column({ type: 'datetime', nullable: true, name: 'system_inclusion_date' })
  inclusionDate?: Date;

  @Column({ type: 'datetime', nullable: true, name: 'system_created_date' })
  physicalDocumentCreatedDate?: Date;

  @Column({ type: 'varchar', length: 255, name: 'document_company_fk' })
  companyId: string;

  @Column({ type: 'varchar', length: 255, name: 'document_category_fk' })
  categoryId: string;

  @Column({ type: 'varchar', length: 255, name: 'document_departament_fk' })
  departamentId: string;

  @Column({ type: 'varchar', length: 255, name: 'document_project_fk' })
  projectId: string;

  document: ConvertedFile[];

  @ManyToOne(() => Category, (category) => category.documents)
  @JoinColumn({ name: 'document_category_fk' })
  category: Category;

  @ManyToOne(() => Departament, (departament) => departament.documents)
  @JoinColumn({ name: 'document_departament_fk' })
  departament: Departament;

  @ManyToOne(() => Project, (project) => project.documents)
  @JoinColumn({ name: 'document_project_fk' })
  project: Project;

  categoryName?: string;
  departamentName?: string;
  companyName?: string;

  @OneToMany(() => DocumentRevision, (revision) => revision.document)
  documentRevisions: DocumentRevision[];

  @OneToMany(() => Evaluators, (evaluator) => evaluator.document)
  evaluators: Evaluators[];
}
