import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import ConvertedFile from 'src/modules/shared/dtos/converted-file';
import { AdditionalDocumentsService } from '../services/addittional-document.service';

@Controller('equipments/additional-documents')
export class AdditionalDocumentsController {
  constructor(
    private readonly additionalDocumentsService: AdditionalDocumentsService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async getAdditionalDocuments(@Req() req, @Query() data) {
    return await this.additionalDocumentsService.get(
      req.user.companyId,
      req.params.id,
      {
        page: data.page,
        pageSize: data.pageSize,
        search: data.search,
      },
    );
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  async createAdditionalDocuments(
    @Body() data: { documents: ConvertedFile[] },
    @Param('id') id: number,
  ) {
    return await this.additionalDocumentsService.createAdditionalDocuments(
      id,
      data.documents,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.additionalDocumentsService.delete(id);
  }
}
