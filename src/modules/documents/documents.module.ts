import { Module } from '@nestjs/common';
import { DocumentsController } from './controllers/documents.controller';
import { DocumentsService } from './services/documents.service';
import { Document } from './entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';

@Module({
  controllers: [DocumentsController],
  imports: [TypeOrmModule.forFeature([Document]), SharedModule],
  providers: [DocumentsService],
  exports: [],
})
export class DocumentsModule {}
