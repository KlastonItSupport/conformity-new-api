import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('uploads')
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'storage_key', type: 'varchar' })
  storageKey: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  ext: string;

  @Column({ type: 'varchar' })
  module: string;

  @Column({ name: 'uploads_module_id_fk', type: 'varchar' })
  moduleId: string;

  @Column({ name: 'uploads_company_id_fk', type: 'varchar' })
  companyId: string;
}
