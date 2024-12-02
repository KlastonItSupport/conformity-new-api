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
import { SchoolsService } from '../services/schools.service';
import { CreateSchoolDto } from '../dtos/create-school.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(@Query() query, @Req() req) {
    return await this.schoolsService.get(
      {
        page: query.page ?? 1,
        pageSize: 10,
        search: query.search ?? '',
      },
      req.user.id,
      req.user.companyId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() data: CreateSchoolDto) {
    return await this.schoolsService.createSchools(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id) {
    return await this.schoolsService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async edit(@Param('id') id, @Body() data: CreateSchoolDto, @Req() req) {
    return await this.schoolsService.edit(data, id, req.user.id);
  }
}
