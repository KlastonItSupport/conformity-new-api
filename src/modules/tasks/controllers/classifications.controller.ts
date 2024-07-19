import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ClassificationsServices } from '../services/classifications.services';

@Controller('classifications')
export class ClassificationsController {
  constructor(
    private readonly classificationsService: ClassificationsServices,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getClassifications(@Req() req) {
    return await this.classificationsService.getClassifications(
      req.user.companyId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async createClassification(@Body() data, @Req() req) {
    return await this.classificationsService.createClassification(
      data.name,
      req.user.companyId,
    );
  }
}
