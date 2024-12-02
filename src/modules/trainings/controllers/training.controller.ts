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
import { CreateTrainingPayload } from '../dtos/create-training-payload';
import { TrainingService } from '../services/training.service';
import { UpdateTraining } from '../dtos/update-training.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(@Query() query, @Req() req) {
    return await this.trainingService.get(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      req.user.id,
      req.user.companyId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateTrainingPayload) {
    return await this.trainingService.create(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    return await this.trainingService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateTraining,
    @Req() req,
  ) {
    return this.trainingService.update(id, data, req.user.id);
  }
}
