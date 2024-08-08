import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Repository } from 'typeorm';
import { Upload } from '../entities/upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface UploadFileParams {
  file: Buffer;
  path: string;
  fileType?: string;
  fileName?: string;
  moduleId?: string;
  companyId?: string;
  id?: string;
}
@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {
    const credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };

    this.s3 = new S3Client({ region: 'us-east-2', credentials });
  }

  async uploadFile(params: UploadFileParams): Promise<Upload> {
    const id = uuidv4();
    const pathOnS3 = `${params.path}/${id}_${params.fileName}`;

    const paramsS3: PutObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: pathOnS3,
      Body: params.file,
      ContentType: params.fileType ?? 'application/pdf',
    };

    try {
      const command = new PutObjectCommand({
        ...paramsS3,
        Key: pathOnS3,
      });
      const resBucket = await this.s3.send(command);

      if (resBucket.$metadata.httpStatusCode === 200 && params.companyId) {
        const upload = this.uploadRepository.create({
          name: params.fileName ?? '',
          storageKey: `${id}_${params.fileName}`,
          link: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${pathOnS3}`,
          path: pathOnS3,
          size: params.file.byteLength,
          type: params.fileType ?? 'application/pdf',
          ext: params.fileType,
          module: params.id,
          moduleId: params.moduleId,
          companyId: params.companyId,
        });
        const uploadSaved = await this.uploadRepository.save(upload);
        return uploadSaved;
      }
    } catch (error) {
      console.error('Erro ao enviar arquivo para o S3:', error);
      throw error;
    }
  }

  async deleteFile(path: string) {
    try {
      const responseS3 = await this.s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: path,
        }),
      );

      return responseS3.$metadata.httpStatusCode === 204;
    } catch (error) {
      console.error('Erro ao deletar arquivo do S3:', error);
      throw error;
    }
  }

  async transferObject(
    sourceUrl: string,
    destinationPath: string,
    name: string,
    companyId: string,
    moduleId: string,
    id: string,
  ) {
    try {
      const response = await axios.get(sourceUrl, {
        responseType: 'arraybuffer',
      });

      const fileType = sourceUrl.endsWith('.pdf')
        ? 'application/pdf'
        : 'Content-Disposition: inline';

      const uploadResult = await this.uploadFile({
        file: response.data,
        fileType: fileType,
        fileName: name,
        moduleId: moduleId,
        companyId: companyId,
        id: id,
        path: destinationPath,
      });

      return uploadResult.link;
    } catch (error) {
      console.error('Erro ao transferir objeto:', error);
      throw error;
    }
  }
}
