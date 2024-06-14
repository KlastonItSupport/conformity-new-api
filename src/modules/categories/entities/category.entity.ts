import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Document } from 'src/modules/documents/entities/document.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'categories_company_fk' })
  companyId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('varchar')
  name: string;

  @OneToMany(() => Document, (document) => document.category)
  documents: Document[];
}
