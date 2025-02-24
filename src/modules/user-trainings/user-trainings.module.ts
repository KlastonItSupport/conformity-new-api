import { Module } from '@nestjs/common';
import { UserTrainingsController } from './controllers/user-trainings.controller';
import { UserTrainingsService } from './services/user-trainings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingUser } from './entities/user-training.entity';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../shared/shared.module';
import { Upload } from '../shared/entities/upload.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingUser, Upload]),
    UsersModule,
    SharedModule,
  ],
  controllers: [UserTrainingsController],
  providers: [UserTrainingsService],
  exports: [UserTrainingsService],
})
export class UserTrainingsModule {}
