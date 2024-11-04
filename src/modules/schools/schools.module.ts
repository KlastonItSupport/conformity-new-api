import { Module } from '@nestjs/common';
import { SchoolsController } from './controllers/schools.controller';
import { SchoolsService } from './services/schools.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities/schools.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([School]), UsersModule],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
