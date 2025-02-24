import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Upload])],
  providers: [S3Service],
  exports: [S3Service, TypeOrmModule.forFeature([Upload])],
})
export class SharedModule {}
