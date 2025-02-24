import { Module } from '@nestjs/common';
import { FeedController } from './controllers/feed.controller';
import { Feed } from './entities/feed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedService } from './services/feed.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feed]), SharedModule],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
