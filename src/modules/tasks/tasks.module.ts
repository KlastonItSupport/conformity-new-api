import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { SharedModule } from '../shared/shared.module';
import { TaskType } from './entities/task-type.entity';
import { TaskOrigin } from './entities/task-origin.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { UsersModule } from '../users/users.module';
import { OriginsController } from './controllers/origins.controller';
import { OriginsServices } from './services/origins.services';
import { Company } from '../companies/entities/company.entity';
import { ClassificationsController } from './controllers/classifications.controller';
import { ClassificationsServices } from './services/classifications.services';
import { TaskClassifications } from './entities/task-classifications.entity';
import { TypesController } from './controllers/types.controller';
import { TypesServices } from './services/types.services';
import { Upload } from '../shared/entities/upload.entity';
import { IndicatorTasks } from '../indicators/entities/indicator-tasks.entity';
import { MailerModule } from '../mailer/mailer.module';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskType,
      TaskOrigin,
      TaskClassifications,
      Company,
      Upload,
      IndicatorTasks,
      User,
    ]),
    SharedModule,
    PermissionsModule,
    UsersModule,
    MailerModule,
  ],
  controllers: [
    TasksController,
    OriginsController,
    ClassificationsController,
    TypesController,
  ],
  providers: [
    TasksService,
    OriginsServices,
    ClassificationsServices,
    TypesServices,
  ],
  exports: [TasksService],
})
export class TasksModule {}
