import { Module } from '@nestjs/common';
import { WarningsService } from './services/warnings.service';
import { WarningsController } from './controllers/warnings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warning } from './entities/warning.entity';
import { SharedModule } from '../shared/shared.module';
import { WarningReader } from './entities/warning-readers.entity';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warning, WarningReader, User]),
    SharedModule,
  ],
  controllers: [WarningsController],
  providers: [WarningsService],
  exports: [WarningsService],
})
export class WarningsModule {}
