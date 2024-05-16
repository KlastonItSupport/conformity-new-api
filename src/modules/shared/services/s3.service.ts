import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor() {
    const credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };

    this.s3 = new S3Client({ region: 'us-east-2', credentials });
  }

  async uploadFile(
    file: Buffer,
    key: string,
    fileType?: string,
  ): Promise<string> {
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: fileType ?? 'application/pdf',
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Erro ao enviar arquivo para o S3:', error);
      throw error;
    }
  }
}
