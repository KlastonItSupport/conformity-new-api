import { Injectable } from '@nestjs/common';
import { Feed } from '../entities/feed.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFeedPayloadDto } from '../dtos/create-feed-payload.dto';
import { AppError } from 'src/errors/app-error';
import { JSDOM } from 'jsdom';
import { getFileTypeFromBase64 } from 'src/helpers/files';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from 'src/modules/shared/services/s3.service';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,

    private readonly s3Service: S3Service,
  ) {}

  async createFeed(data: CreateFeedPayloadDto) {
    const feed = this.feedRepository.create(data);

    if (data.text && data.text.length) {
      const dom = new JSDOM(data.text);
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
          moduleId: process.env.MODULE_TASKS_ID,
          companyId: data.companyId,
          id: `feed-${data.externalId}`,
          path: `${data.companyId}/tasks`,
        });
        image.src = upload.link;
      }
      feed.text = dom.serialize();
    }

    const savedFeed = await this.feedRepository.save(feed);
    const feedWithUser = await this.feedRepository.findOne({
      where: { id: savedFeed.id },
      relations: ['user'],
    });

    return {
      id: feedWithUser.id,
      createdAt: feedWithUser.createdAt,
      text: feedWithUser.text,
      externalId: feedWithUser.externalId,
      moduleId: feedWithUser.moduleId,
      userName: feedWithUser.user.name,
    };
  }

  async getFeed(externalId: string, moduleId: string) {
    const feeds = await this.feedRepository.find({
      where: {
        externalId,
        moduleId,
      },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return feeds.map((feed) => ({
      id: feed.id,
      createdAt: feed.createdAt,
      text: feed.text,
      externalId: feed.externalId,
      moduleId: feed.moduleId,
      userName: feed.user.name,
    }));
  }
  async deleteFeedItem(id: string) {
    const feed = await this.feedRepository.findOne({
      where: { id },
    });
    if (!feed) {
      throw new AppError('Feed not found', 404);
    }
    return await this.feedRepository.remove(feed);
  }

  async updateFeedItem(id: string, text: string, companyId: string) {
    const feed = await this.feedRepository.findOne({
      where: { id },
    });
    if (!feed) {
      throw new AppError('Feed not found', 404);
    }
    if (text && text.length) {
      const dom = new JSDOM(text);
      const images = Array.from(dom.window.document.querySelectorAll('img'));

      for (const image of images) {
        const base64Data = image.src.split(';base64,').pop();
        if (image.src.includes('http')) {
          continue;
        }
        if (!base64Data) continue;

        const fileType = getFileTypeFromBase64(image.src);
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = uuidv4();

        const upload = await this.s3Service.uploadFile({
          file: buffer,
          fileType: fileType,
          fileName: fileName,
          moduleId: process.env.MODULE_TASKS_ID,
          companyId: companyId,
          id: `feed-${feed.externalId}`,
          path: `${companyId}/tasks`,
        });
        image.src = upload.link;
      }
      feed.text = dom.serialize();
    }

    return await this.feedRepository.save(feed);
  }
}
