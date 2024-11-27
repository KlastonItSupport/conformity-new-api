import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Response,
} from '@nestjs/common';
import { RootCauseAnalysisServices } from '../services/root-cause-analysis.services';
import { CreateRootCauseAnalysisPayload } from '../dtos/create-root-cause-analysis-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';

@Controller('tasks-details/root-cause-analysis')
export class RootCauseAnalysisController {
  constructor(
    private readonly rootCauseAnalysisService: RootCauseAnalysisServices,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createRootCauseAnalysis(
    @Body() data: CreateRootCauseAnalysisPayload,
    @Req() req,
    @Response() res: Res,
  ) {
    const rootCauseAnalysis =
      await this.rootCauseAnalysisService.createRootCauseAnalysis({
        ...data,
        userId: req.user.id,
      });

    return res
      .set({ 'x-audit-event-complement': rootCauseAnalysis.taskId })
      .json(rootCauseAnalysis);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteRootCauseAnalysis(@Param('id') id: number, @Response() res: Res) {
    const rootCause =
      await this.rootCauseAnalysisService.deleteRootCauseAnalysis(id);

    return res
      .set({ 'x-audit-event-complement': rootCause.taskId })
      .json(rootCause);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async editRootCauseAnalysis(
    @Param('id') id: number,
    @Body() data: Partial<CreateRootCauseAnalysisPayload>,
    @Response() res: Res,
  ) {
    const update = await this.rootCauseAnalysisService.editRootCauseAnalysis(
      id,
      data,
    );
    return res.set({ 'x-audit-event-complement': update.taskId }).json(update);
  }

  @Get(':id')
  getRootCauseAnalysis(@Param('id') id: number) {
    return this.rootCauseAnalysisService.getRootCauseAnalysis(id);
  }
}
