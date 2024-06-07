import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
