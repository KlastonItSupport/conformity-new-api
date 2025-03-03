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
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentDto } from '../dtos/document.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Document } from '../entities/document.entity';
import { PaginationDocumentsDto } from '../dtos/pagination.dto';
import { AdditionalDocumentsPayloadDto } from '../dtos/additional-documents-payload.dto';
import { Response as Res } from 'express';

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
  async deleteDocument(
    @Req() req,
    @Param('id') id: string,
    @Response() res: Res,
  ) {
    const document = await this.documentsService.deleteDocument(
      req.user.id,
      req.user.companyId,
      id,
    );

    return res
      .set({ 'x-audit-event-complement': document.name })
      .json(document);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateDocument(
    @Req() req,
    @Param('id') id: string,
    @Body() data: Document,
    @Response() res: Res,
  ) {
    const documentUpdated = await this.documentsService.updateDocument(
      req.user.id,
      req.user.companyId,
      id,
      data,
    );

    return res
      .set({ 'x-audit-event-complement': documentUpdated.name })
      .json(documentUpdated);
  }

  @Delete('additional-documents/:id')
  @UseGuards(AuthGuard)
  async deleteAditionalDocument(
    @Req() req,
    @Param('id') id: string,
    @Response() res: Res,
  ) {
    const additional = await this.documentsService.deleteAdditionalDocument(
      req.user.id,
      req.user.companyId,
      id,
    );

    return res
      .set({ 'x-audit-event-complement': additional.module })
      .json(additional);
  }

  @Get('document-details/:id')
  @UseGuards(AuthGuard)
  async getAditionalDocument(
    @Req() req,
    @Param('id') id: string,
    @Response() res: Res,
  ) {
    const addittional = await this.documentsService.getAdditionalDocument(id);

    return res
      .set({ 'x-audit-event-complement': addittional.document.name })
      .json(addittional);
  }

  @Post('additional-documents')
  @UseGuards(AuthGuard)
  async createAdditionalDocument(
    @Req() req,
    @Body() data: AdditionalDocumentsPayloadDto,
    @Response() res: Res,
  ) {
    const additionalDocuments =
      await this.documentsService.createAdditionalDocument({
        ...data,
        userId: req.user.id,
      });

    res
      .set({ 'x-audit-event-complement': additionalDocuments[0].module })
      .json(additionalDocuments);
  }

  @Get('permission/:id')
  @UseGuards(AuthGuard)
  async getDocumentPermission(@Req() req, @Param('id') id: string) {
    console.log('=== Permission Check Started ===');
    console.log('Request received for document:', id);
    console.log('User:', req.user);

    try {
      console.log('Permission check initiated:', {
        documentId: id,
        userId: req.user.id,
        companyId: req.user.companyId,
      });

      const document = await this.documentsService.getAdditionalDocument(id);
      console.log('Document found:', !!document);

      if (!document) {
        console.log('Document not found');
        return {
          isAllowed: false,
          message: 'Document not found',
        };
      }

      console.log('Access granted for document:', id);
      return {
        isAllowed: true,
        message: 'Access granted',
      };
    } catch (error) {
      console.error('Permission Check Error:', error);
      return {
        isAllowed: false,
        message: 'Error checking permissions',
      };
    } finally {
      console.log('=== Permission Check Ended ===');
    }
  }
}
