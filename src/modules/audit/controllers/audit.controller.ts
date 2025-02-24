import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
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

  @Get('events')
  @UseGuards(AuthGuard)
  async getAllEvents(@Query() query, @Req() req) {
    return this.auditService.getAll(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      req.user.companyId,
      req.user.id,
    );
  }
}
