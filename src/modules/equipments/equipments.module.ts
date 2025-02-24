import { Module } from '@nestjs/common';
import { EquipmentsController } from './controllers/equipments.controller';
import { EquipmentsService } from './services/equipments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { SharedModule } from '../shared/shared.module';
import { AdditionalDocumentsService } from './services/addittional-document.service';
import { AdditionalDocumentsController } from './controllers/addittional-document.controller';
import { ActionsController } from './controllers/actions.controller';
import { ActionsService } from './services/actions.service';
import { EquipmentAction } from './entities/action.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipment, EquipmentAction]),
    SharedModule,
  ],
  controllers: [
    EquipmentsController,
    AdditionalDocumentsController,
    ActionsController,
  ],
  providers: [EquipmentsService, AdditionalDocumentsService, ActionsService],
  exports: [EquipmentsService, AdditionalDocumentsService, ActionsService],
})
export class EquipmentsModule {}
