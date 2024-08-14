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
import { TypesServices } from '../services/types.services';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesServices) {}

  @Get()
  @UseGuards(AuthGuard)
  async getTypes(@Req() req, @Query() data) {
    return await this.typesService.getTypes(req.user.companyId, {
      page: data.page,
      pageSize: data.pageSize,
      search: data.search,
    });
  }

  @Post()
  @UseGuards(AuthGuard)
  async createType(@Body() data, @Req() req) {
    return await this.typesService.createType(
      req.body.name,
      req.user.companyId,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateOrigin(@Body() data, @Req() req) {
    return this.typesService.updateType(data.id, data.name, req.user.companyId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteType(@Req() req, @Param('id') id) {
    return await this.typesService.deleteType(id, req.user.companyId);
  }
}
