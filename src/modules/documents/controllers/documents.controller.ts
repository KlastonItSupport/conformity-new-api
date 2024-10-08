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
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentDto } from '../dtos/document.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Document } from '../entities/document.entity';
import { PaginationDocumentsDto } from '../dtos/pagination.dto';
import { AdditionalDocumentsPayloadDto } from '../dtos/additional-documents-payload.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getDocuments(
    @Req() req,
    @Query() data,
  ): Promise<PaginationDocumentsDto> {
    return await this.documentsService.getDocuments(
      req.user.companyId,
      req.user.id,
      data.page,
      data.pageSize,
      data.search,
      {
        initialDate: data?.initialDate,
        finalDate: data?.finalDate,
        departamentId: data?.departamentId,
        categoryId: data?.categoryId,
        author: data?.author,
        projectId: data?.projectId,
      },
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async createDocument(@Body() data: CreateDocumentDto, @Req() req) {
    data.status = '';
    return await this.documentsService.createDocument({
      ...data,
      companyId: req.user.companyId,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteDocument(@Req() req, @Param('id') id: string) {
    return await this.documentsService.deleteDocument(
      req.user.id,
      req.user.companyId,
      id,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateDocument(
    @Req() req,
    @Param('id') id: string,
    @Body() data: Document,
  ) {
    return await this.documentsService.updateDocument(
      req.user.id,
      req.user.companyId,
      id,
      data,
    );
  }

  @Delete('additional-documents/:id')
  @UseGuards(AuthGuard)
  async deleteAditionalDocument(@Req() req, @Param('id') id: string) {
    return await this.documentsService.deleteAdditionalDocument(
      req.user.id,
      req.user.companyId,
      id,
    );
  }

  @Get('document-details/:id')
  @UseGuards(AuthGuard)
  async getAditionalDocument(@Req() req, @Param('id') id: string) {
    return await this.documentsService.getAdditionalDocument(id);
  }

  @Post('additional-documents')
  @UseGuards(AuthGuard)
  async createAdditionalDocument(
    @Req() req,
    @Body() data: AdditionalDocumentsPayloadDto,
  ) {
    return await this.documentsService.createAdditionalDocument({
      ...data,
      userId: req.user.id,
    });
  }
}
