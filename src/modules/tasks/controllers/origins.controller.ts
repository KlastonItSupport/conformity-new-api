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
import { OriginsServices } from '../services/origins.services';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('origins')
export class OriginsController {
  constructor(private readonly originsService: OriginsServices) {}

  @Get()
  @UseGuards(AuthGuard)
  getOrigins(@Req() req, @Query() data) {
    return this.originsService.getOrigins(req.user.companyId, {
      page: data.page,
      pageSize: data.pageSize,
      search: data.search,
    });
  }

  @Post()
  @UseGuards(AuthGuard)
  async createOrigin(@Body() data, @Req() req) {
    return this.originsService.createOrigin(data.name, req.user.companyId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateOrigin(@Body() data, @Req() req) {
    return this.originsService.updateOrigin(
      data.id,
      data.name,
      req.user.companyId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteOrigin(@Req() req, @Param('id') id) {
    return this.originsService.deleteOrigin(id, req.user.companyId);
  }
}
