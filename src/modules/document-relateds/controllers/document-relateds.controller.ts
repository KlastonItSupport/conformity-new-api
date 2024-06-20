import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DocumentRelatedsService } from '../services/document-relateds.services';
import { CreateRelatedPayload } from '../dtos/create-related-payload';

@Controller('document-relateds')
export class DocumentRelatedsController {
  constructor(
    private readonly documentRelatedsService: DocumentRelatedsService,
  ) {}

  @Post('')
  async create(@Body() body: CreateRelatedPayload) {
    return this.documentRelatedsService.create(body);
  }

  @Get(':id')
  async getAllRelated(@Param('id') id: string) {
    return this.documentRelatedsService.getAll(id);
  }

  @Delete(':id')
  async deleteAllRelated(@Param('id') id: number) {
    return await this.documentRelatedsService.deleteRelated(id);
  }
}
