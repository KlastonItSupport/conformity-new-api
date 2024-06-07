import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from '../dtos/document.dto';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { JSDOM } from 'jsdom';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
    private readonly s3Service: S3Service,
  ) {}

  getFileTypeFromBase64(base64: string): string {
    const result = /^data:(.+);base64,/.exec(base64);
    return result ? result[1] : null;
  }

  async createDocument(data: CreateDocumentDto) {
    const document = this.documentsRepository.create({
      ...data,
    });
    if (data.description && data.description.length > 0) {
      const dom = new JSDOM(data.description);
      const images = Array.from(dom.window.document.querySelectorAll('img'));

      for (const image of images) {
        const base64Data = image.src.split(';base64,').pop();
        if (!base64Data) continue;

        const fileType = this.getFileTypeFromBase64(image.src);
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = uuidv4();

        const s3Url = await this.s3Service.uploadFile({
          file: buffer,
          fileType: fileType,
          fileName: fileName,
          moduleId: process.env.MODULE_DOCUMENTS_ID,
          companyId: data.companyId,
          id: 'empty',
          path: `${data.companyId}/documents`,
        });
        image.src = s3Url;
      }

      document.description = dom.serialize();
    }
    const savedDocument = await this.documentsRepository.save(document);

    if (data.document && data.document.length > 0) {
      await Promise.all(
        data.document.map(async (file) => {
          await this.s3Service.uploadFile({
            file: Buffer.from(file.base, 'base64'),
            fileType: file.type,
            fileName: file.name,
            moduleId: process.env.MODULE_DOCUMENTS_ID,
            companyId: data.companyId,
            id: savedDocument.id,
            path: `${data.companyId}/documents`,
          });
        }),
      );
    }

    return savedDocument;
  }
}
