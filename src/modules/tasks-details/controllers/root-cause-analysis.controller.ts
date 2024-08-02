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
} from '@nestjs/common';
import { RootCauseAnalysisServices } from '../services/root-cause-analysis.services';
import { CreateRootCauseAnalysisPayload } from '../dtos/create-root-cause-analysis-payload';
import { AuthGuard } from 'src/guards/auth.guard';

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
  ) {
    return await this.rootCauseAnalysisService.createRootCauseAnalysis({
      ...data,
      userId: req.user.id,
    });
  }

  @Delete(':id')
  async deleteRootCauseAnalysis(@Param('id') id: number) {
    return await this.rootCauseAnalysisService.deleteRootCauseAnalysis(id);
  }

  @Patch(':id')
  editRootCauseAnalysis(
    @Param('id') id: number,
    @Body() data: Partial<CreateRootCauseAnalysisPayload>,
  ) {
    return this.rootCauseAnalysisService.editRootCauseAnalysis(id, data);
  }

  @Get(':id')
  getRootCauseAnalysis(@Param('id') id: number) {
    return this.rootCauseAnalysisService.getRootCauseAnalysis(id);
  }
}
