import { Injectable } from '@nestjs/common';
import { Warning } from '../entities/warning.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWarningDto } from '../dtos/create-warning.dto';
import { JSDOM } from 'jsdom';
import { getFileTypeFromBase64 } from 'src/helpers/files';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from 'src/modules/shared/services/s3.service';
import { WarningReader } from '../entities/warning-readers.entity';
import { ReadWarningDto } from '../dtos/read-warning.dto';
import { User } from 'src/modules/users/entities/users.entity';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class WarningsService {
  constructor(
    @InjectRepository(Warning)
    private readonly warningRepository: Repository<Warning>,

    @InjectRepository(WarningReader)
    private readonly warningReaderRepository: Repository<WarningReader>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly s3Service: S3Service,
  ) {}

  async createWarning(data: CreateWarningDto) {
    const warning = this.warningRepository.create(data);
    const warningSaved = await this.warningRepository.save(warning);

    if (data.warningMessage && data.warningMessage.length > 0) {
      const dom = new JSDOM(data.warningMessage);
      const images = Array.from(dom.window.document.querySelectorAll('img'));

      for (const image of images) {
        const base64Data = image.src.split(';base64,').pop();
        if (!base64Data) continue;

        const fileType = getFileTypeFromBase64(image.src);
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = uuidv4();

        const upload = await this.s3Service.uploadFile({
          file: buffer,
          fileType: fileType,
          fileName: fileName,
          moduleId: process.env.MODULE_DOCUMENTS_ID,
          companyId: data.companyId,
          id: warningSaved.id.toString(),
          path: `${data.companyId}/companies`,
        });
        image.src = upload.link;
      }
      warningSaved.warningMessage = dom.serialize();
    }

    return await this.warningRepository.save(warningSaved);
  }

  async getUserWarnings(userId: string, companyId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || user.companyId !== companyId) {
      throw new AppError('User not found or doenst belong to the company', 404);
    }

    return await this.warningRepository
      .createQueryBuilder('warning')
      .leftJoin(
        'warning.warningReaders',
        'warningReader',
        'warningReader.readers_user_fk = :userId',
        { userId },
      )
      .where('warning.showWarning = :showWarning', { showWarning: true })
      .andWhere('warningReader.id IS NULL') // Somente avisos não lidos pelo usuário
      .andWhere('warning.companyId = :companyId', { companyId })
      .getMany();
  }

  async readWarning(data: ReadWarningDto) {
    const warningReader = await this.warningReaderRepository.findOne({
      where: { warningId: data.warningId, userId: data.userId },
    });

    if (!warningReader) {
      const createWarning = this.warningReaderRepository.create({
        warningId: data.warningId,
        userId: data.userId,
      });
      return await this.warningReaderRepository.save(createWarning);
    }
    return warningReader;
  }
}
