import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('documents_related')
export class DocumentRelated {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'main_doc_documents_fk' })
  mainDocId: string;

  @Column({ name: 'side_doc_documents_fk' })
  relatedDocId: string;
}
