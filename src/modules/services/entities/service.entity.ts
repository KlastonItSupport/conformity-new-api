import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'services_company_fk', type: 'varchar' })
  companyId: string;

  @Column({ type: 'varchar' })
  service: string;

  @Column({ type: 'varchar' })
  value: string;
}
