import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DepartamentService } from '../services/departament.services';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateDepartamentDto } from '../dtos/departament-category.dto';

@Controller('departaments')
export class DepartamentController {
  constructor(private readonly departamentService: DepartamentService) {}

  @Post()
  createDepartament(@Body() data: CreateDepartamentDto) {
    return this.departamentService.createCategory(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(@Req() req) {
    return this.departamentService.findAll(req.user.companyId);
  }
}
