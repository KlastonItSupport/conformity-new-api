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
import { AuthGuard } from 'src/guards/auth.guard';
import { ClassificationsServices } from '../services/classifications.services';

@Controller('classifications')
export class ClassificationsController {
  constructor(
    private readonly classificationsService: ClassificationsServices,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getClassifications(@Req() req, @Query() data) {
    return await this.classificationsService.getClassifications(
      req.user.companyId,
      {
        page: data.page,
        pageSize: data.pageSize,
        search: data.search,
      },
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

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteClassification(@Req() req, @Param('id') id) {
    return await this.classificationsService.deleteClassification(
      id,
      req.user.companyId,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateClassification(@Body() data, @Req() req, @Param('id') id) {
    return this.classificationsService.updateClassification(
      id,
      data.name,
      req.user.companyId,
    );
  }
}
