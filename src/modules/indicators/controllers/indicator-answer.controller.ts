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
import { IndicatorAnswerService } from '../services/indicator-answer.service';
import { CreateIndicatorAnswerDto } from '../dtos/answer-payload';
import { PagesParams } from '../dtos/pages-params.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('indicators/indicator-answer')
export class IndicatorAnswerController {
  constructor(
    private readonly indicatorAnswerService: IndicatorAnswerService,
  ) {}

  @Get(':id')
  async get(
    @Query() data: PagesParams,
    @Query()
    searchSelects: {
      initialDate?: string;
      finalDate?: string;
    },
    @Req() req,
    @Param('id') id,
  ) {
    return await this.indicatorAnswerService.get(
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
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateIndicatorAnswerDto, @Req() req) {
    return this.indicatorAnswerService.create({
      ...data,
      companyId: req.user.companyId,
    });
  }

  @Delete('/:id')
  async delete(@Param('id') id) {
    return this.indicatorAnswerService.delete(id);
  }

  @Patch('/:id')
  async update(@Body() data: CreateIndicatorAnswerDto, @Param('id') id) {
    return this.indicatorAnswerService.update(data, id);
  }
}
