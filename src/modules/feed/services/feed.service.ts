import { Injectable } from '@nestjs/common';
import { Feed } from '../entities/feed.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFeedPayloadDto } from '../dtos/create-feed-payload.dto';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  async createFeed(data: CreateFeedPayloadDto) {
    const feed = this.feedRepository.create(data);
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

  async updateFeedItem(id: string, text: string) {
    const feed = await this.feedRepository.findOne({
      where: { id },
    });
    if (!feed) {
      throw new AppError('Feed not found', 404);
    }
    feed.text = text;

    return await this.feedRepository.save(feed);
  }
}
