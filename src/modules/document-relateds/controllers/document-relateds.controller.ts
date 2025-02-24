import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Response,
} from '@nestjs/common';
import { DocumentRelatedsService } from '../services/document-relateds.services';
import { CreateRelatedPayload } from '../dtos/create-related-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('document-relateds')
export class DocumentRelatedsController {
  constructor(
    private readonly documentRelatedsService: DocumentRelatedsService,
  ) {}

  @Post('')
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateRelatedPayload, @Response() res: Res) {
    const related = await this.documentRelatedsService.create(body);
    return res
      .set({ 'x-audit-event-complement': body.mainDocId })
      .json(related);
  }

  @Get(':id')
  async getAllRelated(@Param('id') id: string) {
    return this.documentRelatedsService.getAll(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteAllRelated(@Param('id') id: number, @Response() res: Res) {
    const related = await this.documentRelatedsService.deleteRelated(id);
    return res
      .set({ 'x-audit-event-complement': related.mainDocId })
      .json(related);
  }
}
