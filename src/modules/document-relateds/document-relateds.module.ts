import { Module } from '@nestjs/common';
import { DocumentRelatedsService } from './services/document-relateds.services';
import { DocumentRelatedsController } from './controllers/document-relateds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentRelated } from './entities/document-related.entity';
import { Document } from '../documents/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentRelated, Document])],
  providers: [DocumentRelatedsService],
  controllers: [DocumentRelatedsController],
  exports: [DocumentRelatedsService],
})
export class DocumentRelatedsModule {}
