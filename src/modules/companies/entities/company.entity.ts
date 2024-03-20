import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ name: 'memory_limit' })
  memoryLimit: number;

  @Column({ name: 'users_limit' })
  usersLimit: number;

  @Column()
  number: number;

  @Column()
  contact: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column()
  celphone: string;

  @Column()
  city: string;

  @Column()
  neighborhood: string;

  @Column()
  address: string;

  @Column()
  complement: string;

  @Column({ unique: true })
  email: string;

  @Column()
  status: string;
}
