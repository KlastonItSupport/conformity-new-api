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
  Response,
} from '@nestjs/common';
import { CreateFeedPayloadDto } from '../dtos/create-feed-payload.dto';
import { FeedService } from '../services/feed.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createFeed(
    @Body() data: CreateFeedPayloadDto,
    @Req() req,
    @Response() res: Res,
  ) {
    const feed = await this.feedService.createFeed({
      ...data,
      companyId: req.user.companyId,
    });

    return res.set({ 'x-audit-event-complement': feed.externalId }).json(feed);
  }

  @Get('')
  async getFeed(
    @Query('externalId') externalId: string,
    @Query('moduleId') moduleId: string,
  ) {
    return await this.feedService.getFeed(externalId, moduleId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteFeedItem(@Query('id') id: string, @Response() res: Res) {
    const feed = await this.feedService.deleteFeedItem(id);
    return res.set({ 'x-audit-event-complement': feed.externalId }).json(feed);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateFeedItem(
    @Query('id') id: string,
    @Body() data,
    @Req() req,
    @Response() res: Res,
  ) {
    const updated = await this.feedService.updateFeedItem(
      id,
      data.text,
      req.user.companyId,
    );

    return res
      .set({ 'x-audit-event-complement': updated.externalId })
      .json(updated);
  }
}
