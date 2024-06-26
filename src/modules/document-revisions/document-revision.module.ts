import { Module } from '@nestjs/common';
import { DocumentRevisionsController } from './controllers/document-revision.controller';
import { DocumentRevisionService } from './services/document-revision.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentRevision } from './entities/document-revision.entity';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentRevision, User])],
  controllers: [DocumentRevisionsController],
  providers: [DocumentRevisionService],
})
export class DocumentRevisionsModule {}
