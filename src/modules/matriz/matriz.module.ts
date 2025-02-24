import { Module } from '@nestjs/common';
import { MatrizController } from './controllers/matriz.controller';
import { MatrizService } from './services/matriz.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from '../trainings/entities/training.entity';
import { User } from '../users/entities/users.entity';
import { TrainingUser } from '../user-trainings/entities/user-training.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Training, User, TrainingUser]),
    UsersModule,
  ],
  controllers: [MatrizController],
  providers: [MatrizService],
})
export class MatrizModule {}
