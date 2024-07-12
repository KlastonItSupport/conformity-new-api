import { Module } from '@nestjs/common';
import { DepartamentsPermissionsController } from './controllers/departaments-permisssions.controller';
import { DepartamentPermissionsService } from './services/departament-permissions.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentPermissions } from './entities/departament-permissions.entity';
import { Departament } from '../departaments/entities/departament.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepartamentPermissions, Departament])],
  providers: [DepartamentPermissionsService],
  controllers: [DepartamentsPermissionsController],
  exports: [DepartamentPermissionsService],
})
export class DepartamentsPermissionsModule {}
