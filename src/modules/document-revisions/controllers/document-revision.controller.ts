import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { DocumentRevisionService } from '../services/document-revision.services';
import { CreateDocumentRevisionPayloadDto } from '../dtos/create-revision.dto';
import { UpdateRevisionPayloadDto } from '../dtos/update-revision-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('document-revisions')
export class DocumentRevisionsController {
  constructor(
    private readonly documentRevisionService: DocumentRevisionService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createRevision(
    @Body() data: CreateDocumentRevisionPayloadDto,
    @Response() res: Res,
  ) {
    const revision = await this.documentRevisionService.createRevision(data);
    return res
      .set({ 'x-audit-event-complement': data.documentId })
      .json(revision);
  }

  @Get(':documentId')
  async getDocumentRevisions(@Param('documentId') documentId: string) {
    return await this.documentRevisionService.getDocumentRevisions(documentId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteDocumentRevision(@Param('id') id: number) {
    return await this.documentRevisionService.deleteDocumentRevision(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateDocumentRevision(
    @Param('id') id: number,
    @Body() data: UpdateRevisionPayloadDto,
    @Response() res: Res,
  ) {
    const revision = await this.documentRevisionService.updateDocumentRevision(
      id,
      data,
    );
    return res
      .set({ 'x-audit-event-complement': revision.documentId })
      .json(revision);
  }

  @Get('company/revisions')
  @UseGuards(AuthGuard)
  async getCompanyRevisions(@Req() req, @Query() data) {
    return await this.documentRevisionService.getCompanyRevisions(
      req.user.companyId,
      data.page,
      data.pageSize,
      data.search,
    );
  }
}
