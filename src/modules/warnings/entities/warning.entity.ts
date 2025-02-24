import { Company } from 'src/modules/companies/entities/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { WarningReader } from './warning-readers.entity';

@Entity('warnings')
export class Warning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'show_warning', type: 'boolean', nullable: true })
  showWarning: boolean;

  @Column({ name: 'fk_warnings_company', type: 'varchar' })
  companyId: string;

  @Column({ name: 'warning_message', type: 'longtext', nullable: true })
  warningMessage: string;

  @Column({ name: 'expired_at' })
  expiredAt: Date;

  @ManyToOne(() => Company, (company) => company.warnings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_warnings_company' })
  company: Company;

  @OneToMany(() => WarningReader, (warningReader) => warningReader.warning)
  warningReaders: WarningReader[];
}
