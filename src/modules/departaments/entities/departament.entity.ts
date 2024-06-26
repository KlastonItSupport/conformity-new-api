import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Document } from 'src/modules/documents/entities/document.entity';
import { DepartamentPermissions } from 'src/modules/departaments-permissions/entities/departament-permissions.entity';

@Entity('departaments')
export class Departament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'department_company_fk' })
  companyId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('varchar')
  name: string;

  @OneToMany(() => Document, (document) => document.departament)
  documents: Document[];

  @OneToMany(
    () => DepartamentPermissions,
    (permission) => permission.department,
  )
  permissions: DepartamentPermissions[];
}
