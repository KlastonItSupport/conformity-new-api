import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';

@Module({
  providers: [S3Service],
})
export class SharedModule {}
