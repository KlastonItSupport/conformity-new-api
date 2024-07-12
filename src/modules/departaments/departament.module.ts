import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departament } from './entities/departament.entity';
import { DepartamentController } from './controllers/departament.controller';
import { DepartamentService } from './services/departament.services';

@Module({
  imports: [TypeOrmModule.forFeature([Departament])],
  providers: [DepartamentService],
  controllers: [DepartamentController],
  exports: [DepartamentService],
})
export class DepartamentModule {}
