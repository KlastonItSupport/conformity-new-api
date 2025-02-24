import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('group_module_permissions')
export class GroupModulePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fk_group_id', type: 'varchar' })
  groupId: string;

  @Column({ name: 'fk_permissions', type: 'varchar' })
  permissionsId: string;
}
