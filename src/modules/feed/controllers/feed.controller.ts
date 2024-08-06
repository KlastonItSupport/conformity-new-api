import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateFeedPayloadDto } from '../dtos/create-feed-payload.dto';
import { FeedService } from '../services/feed.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createFeed(@Body() data: CreateFeedPayloadDto, @Req() req) {
    return await this.feedService.createFeed({
      ...data,
      companyId: req.user.companyId,
    });
  }

  @Get('')
  async getFeed(
    @Query('externalId') externalId: string,
    @Query('moduleId') moduleId: string,
  ) {
    return await this.feedService.getFeed(externalId, moduleId);
  }

  @Delete(':id')
  async deleteFeedItem(@Query('id') id: string) {
    return await this.feedService.deleteFeedItem(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateFeedItem(@Query('id') id: string, @Body() data, @Req() req) {
    return await this.feedService.updateFeedItem(
      id,
      data.text,
      req.user.companyId,
    );
  }
}
