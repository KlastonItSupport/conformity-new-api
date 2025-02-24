import { Module } from '@nestjs/common';
import { DocumentRevisionsController } from './controllers/document-revision.controller';
import { DocumentRevisionService } from './services/document-revision.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentRevision } from './entities/document-revision.entity';
import { User } from '../users/entities/users.entity';
import { Document } from '../documents/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentRevision, User, Document])],
  controllers: [DocumentRevisionsController],
  providers: [DocumentRevisionService],
  exports: [DocumentRevisionService],
})
export class DocumentRevisionsModule {}
