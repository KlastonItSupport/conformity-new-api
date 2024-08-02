import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EvaluatorService } from '../services/evaluators.services';
import { CreateEvaluatorDto } from '../dtos/create-evaluator-payload';

@Controller('tasks-details/evaluators')
export class EvaluatorsController {
  constructor(private readonly evaluatorService: EvaluatorService) {}

  @Post()
  async createEvaluator(@Body() data: CreateEvaluatorDto) {
    return this.evaluatorService.createEvaluator(data);
  }

  @Delete(':id')
  deleteEvaluator(@Param('id') data: number) {
    return this.evaluatorService.deleteEvaluator(data);
  }

  @Get(':id')
  getEvaluator(@Param('id') id: number) {
    return this.evaluatorService.getEvaluator(id);
  }
}
