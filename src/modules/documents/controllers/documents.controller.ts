import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentDto } from '../dtos/document.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

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
}
