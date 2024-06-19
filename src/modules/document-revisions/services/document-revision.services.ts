import { Injectable } from '@nestjs/common';
import { CreateDocumentRevisionPayloadDto } from '../dtos/create-revision.dto';
import { Repository } from 'typeorm';
import { DocumentRevision } from '../entities/document-revision.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/users.entity';
import { UpdateRevisionPayloadDto } from '../dtos/update-revision-payload';

@Injectable()
export class DocumentRevisionService {
  constructor(
    @InjectRepository(DocumentRevision)
    private readonly documentRevisionRepository: Repository<DocumentRevision>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createRevision(data: CreateDocumentRevisionPayloadDto) {
    const documentRevision = this.documentRevisionRepository.create(data);
    const savedDocumentRevision =
      await this.documentRevisionRepository.save(documentRevision);
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });
    savedDocumentRevision.userName = user?.name;
    return savedDocumentRevision;
  }

  async getDocumentRevisions(documentId: string) {
    const documentRevisions = await this.documentRevisionRepository.find({
      where: { documentId },
    });

    await Promise.all(
      documentRevisions.map(async (documentRevision) => {
        const user = await this.userRepository.findOne({
          where: { id: documentRevision.userId },
        });
        documentRevision.userName = user?.name;
      }),
    );
    return documentRevisions;
  }

  async deleteDocumentRevision(id: number) {
    const documentRevision = await this.documentRevisionRepository.findOne({
      where: { id },
    });
    return await this.documentRevisionRepository.remove(documentRevision);
  }

  async updateDocumentRevision(id: number, data: UpdateRevisionPayloadDto) {
    const documentRevision = await this.documentRevisionRepository.findOne({
      where: { id },
    });

    if (!documentRevision) {
      throw new Error('Document revision not found');
    }
    if (data.description) {
      documentRevision.description = data.description;
    }
    if (data.revisionDate) {
      documentRevision.revisionDate = data.revisionDate;
    }

    const user = await this.userRepository.findOne({
      where: { id: documentRevision.userId },
    });
    const savedDocumentRevision =
      await this.documentRevisionRepository.save(documentRevision);

    savedDocumentRevision.userName = user?.name;
    return savedDocumentRevision;
  }
}
