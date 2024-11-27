import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from '../entities/audit.entity';
import { AuditDto } from '../dtos/create-audit-payload';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async store(data: AuditDto): Promise<void> {
    if (data.method === 'valida_email') {
      return;
    }

    const description = await this.getComplement(
      data.description,
      data.complement,
      data.key,
    );

    const audit = this.auditRepository.create({ ...data, description });
    await this.auditRepository.save(audit);
  }

  async getComplement(description: string, complement?: string, id?: any) {
    let complementFormatted = description;

    if (id) {
      complementFormatted = complementFormatted.replace('$id', id);
    }

    if (complement) {
      complementFormatted = complementFormatted.replace(
        '$complement',
        complement,
      );
    }

    return complementFormatted;
  }
}
