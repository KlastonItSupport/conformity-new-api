import { Module } from '@nestjs/common';
import { LeadsService } from './services/leads.service';
import { LeadsController } from './controllers/leads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/leads.entity';
import { UsersModule } from '../users/users.module';
import { TasksLeadsService } from './services/tasks-leads.service';
import { TasksLeadsController } from './controllers/tasks-leads.controller';
import { LeadTask } from './entities/task-lead.entity';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, LeadTask]),
    UsersModule,
    SharedModule,
  ],
  controllers: [LeadsController, TasksLeadsController],
  providers: [LeadsService, TasksLeadsService],
  exports: [LeadsService, TasksLeadsService],
})
export class LeadsModule {}
