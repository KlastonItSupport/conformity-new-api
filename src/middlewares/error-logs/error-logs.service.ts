// error-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLog } from './error-logs.entity';

@Injectable()
export class ErrorLogService {
  constructor(
    @InjectRepository(ErrorLog)
    private errorLogRepository: Repository<ErrorLog>,
  ) {}

  async createErrorLog(logData: Partial<ErrorLog>): Promise<ErrorLog> {
    const errorLog = this.errorLogRepository.create(logData);
    return await this.errorLogRepository.save(errorLog);
  }
}
