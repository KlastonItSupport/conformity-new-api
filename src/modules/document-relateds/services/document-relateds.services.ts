import { Injectable } from '@nestjs/common';
import { CreateRelatedPayload } from '../dtos/create-related-payload';
import { Repository } from 'typeorm';
import { DocumentRelated } from '../entities/document-related.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/modules/documents/entities/document.entity';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class DocumentRelatedsService {
  constructor(
    @InjectRepository(DocumentRelated)
    private readonly documentRelatedsRepository: Repository<DocumentRelated>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
  ) {}

  async create(data: CreateRelatedPayload) {
    const mainDoc = await this.documentsRepository.findOne({
      where: { id: data.mainDocId },
      relations: ['category', 'departament'],
    });
    const relatedDoc = await this.documentsRepository.findOne({
      where: { id: data.relatedDocId },
      relations: ['category', 'departament'],
    });

    if (!mainDoc || !relatedDoc) {
      throw new AppError('Document not found', 404);
    }

    mainDoc.categoryName = mainDoc.category?.name;
    mainDoc.departamentName = mainDoc.departament?.name;

    relatedDoc.categoryName = relatedDoc.category?.name;
    relatedDoc.departamentName = relatedDoc.departament?.name;

    const related = this.documentRelatedsRepository.create(data);
    const relatedSaved = await this.documentRelatedsRepository.save(related);

    delete relatedDoc.category;
    delete relatedDoc.departament;

    relatedDoc['relatedDocumentId'] = relatedDoc.id;
    relatedDoc['id'] = relatedSaved.id as unknown as string;

    return relatedDoc;
  }

  async getAll(mainDocId: string) {
    const relateds = await this.documentRelatedsRepository.find({
      where: { mainDocId },
    });

    const documents = await Promise.all(
      relateds.map(async (related) => {
        const document = await this.documentsRepository.findOne({
          where: { id: related.relatedDocId },
          relations: ['category', 'departament'],
        });

        if (document) {
          document['relatedDocumentId'] = document.id;
          document['id'] = related.id as unknown as string;
          document.categoryName = document.category?.name;
          document.departamentName = document.departament?.name;

          delete document.category;
          delete document.departament;
        }

        return document;
      }),
    );

    return documents.filter((doc) => doc !== undefined);
  }

  async deleteRelated(id: number) {
    const related = await this.documentRelatedsRepository.findOne({
      where: [{ id: id }],
    });

    if (!related) {
      throw new AppError('Related not found', 404);
    }

    return await this.documentRelatedsRepository.remove(related);
  }
}
