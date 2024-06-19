import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ type: 'boolean' })
  approved?: boolean;

  @Column({ type: 'boolean' })
  reviewed: boolean;

  @Column({ type: 'boolean' })
  cancelled: boolean;

  @Column({ type: 'boolean' })
  deleted: boolean;

  @Column({ type: 'boolean' })
  edited: boolean;

  @Column({
    name: 'cancel_description',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  cancelDescription: string;

  userName: string;

  // Se não desejar relacionamentos, remova as anotações abaixo
  // @ManyToOne(() => Document)
  // @JoinColumn({ name: 'document_approvals_document_id_fk' })
  // document: Document;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'document_approvals_user_id_fk' })
  // user: User;
}
