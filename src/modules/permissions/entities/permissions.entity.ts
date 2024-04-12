import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permissions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fk_modules_id', type: 'varchar' })
  moduleId: string;

  @Column({ name: 'fk_user_id', type: 'varchar' })
  userId: string;

  @Column({ name: 'can_add', type: 'tinyint' })
  canAdd: number;

  @Column({ name: 'can_read', type: 'tinyint' })
  canRead: number;

  @Column({ name: 'can_edit', type: 'tinyint' })
  canEdit: number;

  @Column({ name: 'can_delete', type: 'tinyint' })
  canDelete: number;
}
