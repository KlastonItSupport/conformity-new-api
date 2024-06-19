import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EvaluatorService } from '../services/evaluator.services';
import { EvaluatorCreatePayload } from '../dtos/create-evaluator-payload';

@Controller('evaluators')
export class EvaluatorController {
  constructor(private readonly evaluatorService: EvaluatorService) {}

  @Post('')
  async createEvaluator(@Body() data: EvaluatorCreatePayload) {
    return await this.evaluatorService.createEvaluator(data);
  }

  @Get(':documentId')
  async getEvaluator(@Param('documentId') documentId: string) {
    return await this.evaluatorService.getEvaluator(documentId);
  }

  @Delete(':id')
  async deleteEvaluator(@Param('id') id: number) {
    return await this.evaluatorService.deleteEvaluator(id);
  }
}
