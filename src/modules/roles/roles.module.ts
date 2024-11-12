import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/departament.entity';
import { RolesController } from './controllers/roles';
import { RolesService } from './services/roles.services';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
