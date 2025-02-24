import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Equipment } from './equipment.entity';

@Entity('equipments_actions')
export class EquipmentAction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Equipment, (equipment) => equipment.actions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'equipments_action_equipment_fk' })
  equipment: Equipment;

  @Column({ type: 'varchar', name: 'equipments_action_equipment_fk' })
  equipmentId: string | number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  validity?: string;

  @Column({ type: 'date', nullable: true, name: 'next_date' })
  nextDate?: Date;

  @Column({ type: 'date', nullable: true })
  date?: Date;
}
