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
  UseGuards,
} from '@nestjs/common';
import { DocumentRevisionService } from '../services/document-revision.services';
import { CreateDocumentRevisionPayloadDto } from '../dtos/create-revision.dto';
import { UpdateRevisionPayloadDto } from '../dtos/update-revision-payload';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('document-revisions')
export class DocumentRevisionsController {
  constructor(
    private readonly documentRevisionService: DocumentRevisionService,
  ) {}

  @Post()
  async createRevision(@Body() data: CreateDocumentRevisionPayloadDto) {
    return await this.documentRevisionService.createRevision(data);
  }

  @Get(':documentId')
  async getDocumentRevisions(@Param('documentId') documentId: string) {
    return await this.documentRevisionService.getDocumentRevisions(documentId);
  }

  @Delete(':id')
  async deleteDocumentRevision(@Param('id') id: number) {
    return await this.documentRevisionService.deleteDocumentRevision(id);
  }

  @Patch(':id')
  async updateDocumentRevision(
    @Param('id') id: number,
    @Body() data: UpdateRevisionPayloadDto,
  ) {
    return await this.documentRevisionService.updateDocumentRevision(id, data);
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
