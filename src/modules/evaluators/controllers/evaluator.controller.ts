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
  Response,
} from '@nestjs/common';
import { EvaluatorService } from '../services/evaluator.services';
import { EvaluatorCreatePayload } from '../dtos/create-evaluator-payload';
import { EvaluatorForAnalysis } from '../dtos/evaluator-for-analysis';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('evaluators')
export class EvaluatorController {
  constructor(private readonly evaluatorService: EvaluatorService) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createEvaluator(
    @Body() data: EvaluatorCreatePayload,
    @Response() res: Res,
  ) {
    const evaluator = await this.evaluatorService.createEvaluator(data);

    return res
      .set({ 'x-audit-event-complement': evaluator.documentId })
      .json(evaluator);
  }

  @Get(':documentId')
  async getEvaluator(@Param('documentId') documentId: string) {
    return await this.evaluatorService.getEvaluator(documentId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteEvaluator(@Param('id') id: number, @Response() res: Res) {
    const evaluator = await this.evaluatorService.deleteEvaluator(id);
    return res
      .set({ 'x-audit-event-complement': evaluator.documentId })
      .json(evaluator);
  }

  @Get('user-analaysis/pending')
  @UseGuards(AuthGuard)
  async getAnalysisFuncDocuments(
    @Req() req,
    @Query() data,
  ): Promise<EvaluatorForAnalysis[]> {
    return await this.evaluatorService.getUserAnalysis(
      req.user.companyId,
      req.user.id,
      data.page,
      data.pageSize,
      data.search,
    );
  }

  @Patch('reviewed/:documentApprovalId')
  async reviewDocumentApproval(
    @Param('documentApprovalId') documentApprovalId: number,
  ) {
    return await this.evaluatorService.reviewDocumentApproval(
      documentApprovalId,
    );
  }

  @Patch('approved/:documentApprovalId')
  async approveDocumentApproval(
    @Param('documentApprovalId') documentApprovalId: number,
  ) {
    return await this.evaluatorService.approveDocumentApproval(
      documentApprovalId,
    );
  }
  @Patch('cancelled/:documentApprovalId')
  async cancelDocumentApproval(
    @Param('documentApprovalId') documentApprovalId: number,
    @Body() data,
  ) {
    return await this.evaluatorService.cancelDocumentApproval(
      documentApprovalId,
      data.description,
    );
  }
}
