import { Module } from '@nestjs/common';
import { LeadsService } from './services/leads.service';
import { LeadsController } from './controllers/leads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/leads.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lead]), UsersModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
