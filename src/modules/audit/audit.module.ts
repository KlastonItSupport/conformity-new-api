import { Module } from '@nestjs/common';
import { AuditService } from './services/audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audit])],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
