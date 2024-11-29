import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuditService } from '../services/audit.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll() {
    return 'Evento registrado com sucesso';
  }
}
