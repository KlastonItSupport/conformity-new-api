import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('document_revisions')
export class DocumentRevision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'revision_date',
  })
  revisionDate: Date;

  @Column('longtext')
  description: string;

  @Column({ name: 'document_revisions_user_id_fk' })
  userId: string;

  @Column({ name: 'document_revisions_document_id_fk' })
  documentId: string;

  userName?: string;
}
