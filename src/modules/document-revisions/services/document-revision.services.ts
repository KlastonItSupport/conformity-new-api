import { Injectable } from '@nestjs/common';
import { CreateDocumentRevisionPayloadDto } from '../dtos/create-revision.dto';
import { Repository } from 'typeorm';
import { DocumentRevision } from '../entities/document-revision.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/users.entity';
import { UpdateRevisionPayloadDto } from '../dtos/update-revision-payload';
import { Document } from 'src/modules/documents/entities/document.entity';
import {
  Links,
  PaginationDocumentRevisionsDto,
} from '../dtos/documents-revisions-pagination.dto';

@Injectable()
export class DocumentRevisionService {
  constructor(
    @InjectRepository(DocumentRevision)
    private readonly documentRevisionRepository: Repository<DocumentRevision>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
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
      relations: ['document'],
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

  async getCompanyRevisions(
    companyId: string,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<any> {
    const pagination = new PaginationDocumentRevisionsDto();

    const documents = await this.documentsRepository.find({
      where: { companyId },
      select: ['id'],
    });

    const documentIds = documents.map((document) => document.id);

    const offset = (page - 1) * limit;

    const queryBuilder = this.documentRevisionRepository
      .createQueryBuilder('documentRevision')
      .leftJoinAndSelect('documentRevision.document', 'document')
      .where('documentRevision.documentId IN (:...documentIds)', {
        documentIds,
      });

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(document.name) LIKE LOWER(:search) OR LOWER(documentRevision.description) LIKE LOWER(:search)) OR (document.id LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.skip(offset).take(limit);

    const [documentRevisions, totalRevisions] =
      await queryBuilder.getManyAndCount();

    documentRevisions.forEach((documentRevision) => {
      documentRevision.documentName = documentRevision.document?.name;
      delete documentRevision.document;
    });

    const totalPages = Math.ceil(totalRevisions / limit);

    const links = {
      first: 1,
      last: totalPages,
      next: page < totalPages ? page + 1 : totalPages,
      previous: page > 1 ? page - 1 : 1,
      currentPage: page,
      totalItems: totalRevisions,
      totalPages: totalPages,
    } as Links;

    pagination.pages = links;
    pagination.items = documentRevisions;

    return pagination;
  }
}
