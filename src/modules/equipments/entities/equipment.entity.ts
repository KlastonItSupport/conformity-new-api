import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EquipmentAction } from './action.entity';

@Entity('equipments')
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'equipments_company_fk' })
  companyId: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  model?: string;

  @Column({ type: 'varchar', nullable: true })
  series?: string;

  @Column({ type: 'varchar', nullable: true })
  manufacturer?: string;

  @Column({ type: 'varchar', nullable: true })
  certified?: string;

  @Column({ type: 'varchar', nullable: true })
  range?: string;

  @Column({ type: 'varchar', nullable: true })
  tolerancy?: string;

  @OneToMany(
    () => EquipmentAction,
    (equipmentAction) => equipmentAction.equipment,
  )
  actions: EquipmentAction[];

  nextAction: any;
}
