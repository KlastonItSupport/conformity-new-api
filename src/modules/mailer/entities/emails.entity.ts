import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('emails_models')
export class EmailModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'text' })
  body: string;
}
