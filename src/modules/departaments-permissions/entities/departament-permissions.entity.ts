import { Departament } from 'src/modules/departaments/entities/departament.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity('document_departments_permissions')
export class DepartamentPermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'document_department_permissions_document_fk' })
  documentId: string;

  @Column({ name: 'is_authorized' })
  isAuthorized: boolean;

  @ManyToOne(() => Departament, (department) => department.permissions)
  @JoinColumn({ name: 'document_department_permissions_department_fk' })
  department: Departament;

  @Column({ name: 'document_department_permissions_department_fk' })
  departamentId: string;
}
