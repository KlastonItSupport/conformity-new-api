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
  Response,
  UseGuards,
} from '@nestjs/common';
import { IndicatorAnswerService } from '../services/indicator-answer.service';
import { CreateIndicatorAnswerDto } from '../dtos/answer-payload';
import { PagesParams } from '../dtos/pages-params.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response as Res } from 'express';
@Controller('indicators/indicator-answer')
export class IndicatorAnswerController {
  constructor(
    private readonly indicatorAnswerService: IndicatorAnswerService,
  ) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async get(
    @Query() data: PagesParams,
    @Query()
    searchSelects: {
      initialDate?: string;
      finalDate?: string;
    },
    @Param('id') id,
    @Response() res: Res,
  ) {
    const indicatorAnswers = await this.indicatorAnswerService.get(
      id,
      {
        page: Number(data.page) ?? 1,
        pageSize: Number(data.pageSize) ?? 10,
        search: data.search,
      },
      {
        initialDate: searchSelects?.initialDate,
        finalDate: searchSelects?.finalDate,
      },
      // req.user.companyId,
    );
    return res.set({ 'x-audit-event-complement': id }).json(indicatorAnswers);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() data: CreateIndicatorAnswerDto,
    @Req() req,
    @Response() res: Res,
  ) {
    const indicatorAnswer = await this.indicatorAnswerService.create({
      ...data,
      companyId: req.user.companyId,
    });

    return res
      .set({ 'x-audit-event-complement': indicatorAnswer.indicatorId })
      .json(indicatorAnswer);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id, @Response() res: Res) {
    const deleted = await this.indicatorAnswerService.delete(id);
    return res
      .set({ 'x-audit-event-complement': deleted.indicatorId })
      .json(deleted);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async update(
    @Body() data: CreateIndicatorAnswerDto,
    @Param('id') id,
    @Response() res: Res,
  ) {
    const updated = await this.indicatorAnswerService.update(data, id);
    return res
      .set({ 'x-audit-event-complement': updated.indicatorId })
      .json(updated);
  }
}
