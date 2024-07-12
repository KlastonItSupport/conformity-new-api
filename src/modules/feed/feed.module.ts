import { Module } from '@nestjs/common';
import { FeedController } from './controllers/feed.controller';
import { Feed } from './entities/feed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedService } from './services/feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed])],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
