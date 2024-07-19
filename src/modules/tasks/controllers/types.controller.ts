import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TypesServices } from '../services/types.services';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesServices) {}

  @Get()
  @UseGuards(AuthGuard)
  async getTypes(@Req() req) {
    return await this.typesService.getTypes(req.user.companyId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createType(@Body() data, @Req() req) {
    return await this.typesService.createType(
      req.body.name,
      req.user.companyId,
    );
  }
}
