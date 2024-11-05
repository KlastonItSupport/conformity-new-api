import { Module } from '@nestjs/common';
import { UserTrainingsController } from './controllers/user-trainings.controller';
import { UserTrainingsService } from './services/user-trainings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingUser } from './entities/user-training.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingUser]), UsersModule],
  controllers: [UserTrainingsController],
  providers: [UserTrainingsService],
  exports: [UserTrainingsService],
})
export class UserTrainingsModule {}
