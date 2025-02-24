import { Document } from 'src/modules/documents/entities/document.entity';
import { User } from 'src/modules/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'documents_approvals' })
export class Evaluators {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ name: 'document_approvals_document_id_fk' })
  documentId: string;

  @Column({ name: 'document_approvals_user_id_fk' })
  userId: string;

  @Column({ type: 'int' })
  approved?: number;

  @Column({ type: 'int' })
  reviewed: number;

  @Column({ type: 'int' })
  cancelled: number;

  @Column({ type: 'int' })
  deleted: number;

  @Column({ type: 'int' })
  edited: number;

  @Column({
    name: 'cancel_description',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  cancelDescription: string;

  userName: string;

  @ManyToOne(() => User, (user) => user.approvals)
  @JoinColumn({ name: 'document_approvals_user_id_fk' }) // Ajuste o nome da coluna aqui
  user: User;

  @ManyToOne(() => Document, (document) => document.evaluators)
  @JoinColumn({ name: 'document_approvals_document_id_fk' })
  document: Document;
}
