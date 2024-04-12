import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GroupPermissions } from '../dtos/create-permission-by-group';

@Entity()
export class Groups {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fk_company_id', type: 'varchar' })
  companyId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'permissions', type: 'json' })
  permissions: GroupPermissions;
}
