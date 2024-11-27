import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { EvaluatorService } from '../services/evaluators.services';
import { CreateEvaluatorDto } from '../dtos/create-evaluator-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';
@Controller('tasks-details/evaluators')
export class EvaluatorsController {
  constructor(private readonly evaluatorService: EvaluatorService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createEvaluator(
    @Body() data: CreateEvaluatorDto,
    @Response() res: Res,
  ) {
    const evaluator = await this.evaluatorService.createEvaluator(data);

    const evaluatorsNames = evaluator
      .map((evaluator) => evaluator.user.name)
      .join('| ');
    return res
      .set({
        'x-audit-event-complement': `${evaluatorsNames} a tarefa #${data.taskId}`,
      })
      .json(evaluator);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteEvaluator(@Param('id') data: number, @Response() res: Res) {
    const deletedEvaluator = await this.evaluatorService.deleteEvaluator(data);
    return res
      .set({
        'x-audit-event-complement': `${deletedEvaluator.user.name} da tarefa #${deletedEvaluator.taskId}`,
      })
      .json(deletedEvaluator);
  }

  @Get(':id')
  getEvaluator(@Param('id') id: number) {
    return this.evaluatorService.getEvaluator(id);
  }
}
