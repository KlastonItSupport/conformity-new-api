// error-logs/error-logs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from './error-logs.entity';
import { ErrorLogService } from './error-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([ErrorLog])],
  providers: [ErrorLog, ErrorLogService],
  exports: [ErrorLog, ErrorLogService],
})
export class ErrorLogsModule {}
