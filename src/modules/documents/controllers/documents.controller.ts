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

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getDocuments(@Req() req, @Query() data): Promise<PaginationDocumentsDto> {
    return this.documentsService.getDocuments(
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
      },
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  createDocument(@Body() data: CreateDocumentDto, @Req() req) {
    data.projectId = '1';
    data.status = '';
    return this.documentsService.createDocument({
      ...data,
      companyId: req.user.companyId,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteDocument(@Req() req, @Param('id') id: string) {
    return this.documentsService.deleteDocument(
      req.user.id,
      req.user.companyId,
      id,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateDocument(@Req() req, @Param('id') id: string, @Body() data: Document) {
    return this.documentsService.updateDocument(
      req.user.id,
      req.user.companyId,
      id,
      data,
    );
  }
}
