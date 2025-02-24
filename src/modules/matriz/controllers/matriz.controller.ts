import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MatrizService } from '../services/matriz.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('matriz')
export class MatrizController {
  constructor(private readonly matrizService: MatrizService) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(@Req() req, @Query() query) {
    return await this.matrizService.get(
      {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        search: query.search ?? '',
      },
      {
        userId: query.userId,
        trainingId: query.trainingId,
        initialDate: query.initialDate,
        endDate: query.endDate,
      },
      req.user.companyId,
    );
  }
}
